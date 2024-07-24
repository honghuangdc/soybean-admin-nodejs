import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { AuthZRBACService } from '@src/infra/casbin';
import { EndpointProperties } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/domain/endpoint.read-model';
import { FindEndpointsByIdsQuery } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/queries/endpoints.by-ids.query';
import { DomainProperties } from '@src/lib/bounded-contexts/iam/domain/domain/domain-read.model';
import { GetDomainByCodeQuery } from '@src/lib/bounded-contexts/iam/domain/queries/domain.by-id.query';
import { MenuProperties } from '@src/lib/bounded-contexts/iam/menu/domain/menu.read-model';
import { MenuIdsByRoleIdQuery } from '@src/lib/bounded-contexts/iam/menu/queries/menu-ids.by-id.query';
import { MenusByIdsQuery } from '@src/lib/bounded-contexts/iam/menu/queries/menus.by-ids.query';
import { RoleProperties } from '@src/lib/bounded-contexts/iam/role/domain/role.read-model';
import { GetRoleByIdQuery } from '@src/lib/bounded-contexts/iam/role/queries/role.by-id.query';
import { PrismaService } from '@src/shared/prisma/prisma.service';

import { RoleAssignPermissionCommand } from '../../commands/role-assign-permission.command';
import { RoleAssignRouteCommand } from '../../commands/role-assign-route.command';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authZRBACService: AuthZRBACService,
    private readonly prisma: PrismaService,
  ) {}

  async assignPermission(command: RoleAssignPermissionCommand) {
    const { domainCode, roleCode } = await this.checkDomainAndRole(
      command.domain,
      command.roleId,
    );

    const permissions = await this.queryBus.execute<
      FindEndpointsByIdsQuery,
      EndpointProperties[]
    >(new FindEndpointsByIdsQuery(command.permissions));
    if (!permissions.length) {
      throw new NotFoundException('One or more permissions not found.');
    }

    const existingPermissions =
      await this.authZRBACService.enforcer.getFilteredPolicy(
        0,
        roleCode,
        '',
        '',
        domainCode,
      );

    await this.syncRolePermissions(
      roleCode,
      domainCode,
      permissions,
      existingPermissions,
    );
  }

  async assignRoutes(command: RoleAssignRouteCommand) {
    const { domainCode, roleId } = await this.checkDomainAndRole(
      command.domain,
      command.roleId,
    );

    const routes = await this.queryBus.execute<
      MenusByIdsQuery,
      MenuProperties[]
    >(new MenusByIdsQuery(command.menuIds));
    if (!routes.length) {
      throw new NotFoundException('One or more routes not found.');
    }

    const existingRouteIds = await this.queryBus.execute<
      MenuIdsByRoleIdQuery,
      number[]
    >(new MenuIdsByRoleIdQuery(roleId, domainCode));

    const newRouteIds = command.menuIds.filter(
      (id) => !existingRouteIds.includes(id),
    );
    const routeIdsToDelete = existingRouteIds.filter(
      (id) => !command.menuIds.includes(id),
    );

    const operations = [
      ...newRouteIds.map((routeId) =>
        this.prisma.sysRoleMenu.create({
          data: {
            roleId: roleId,
            menuId: routeId,
            domain: domainCode,
          },
        }),
      ),
      ...routeIdsToDelete.map((routeId) =>
        this.prisma.sysRoleMenu.deleteMany({
          where: {
            roleId: roleId,
            menuId: routeId,
            domain: domainCode,
          },
        }),
      ),
    ];

    await this.prisma.$transaction(operations);
  }

  private async checkDomainAndRole(domainCode: string, roleId: string) {
    const domain = await this.queryBus.execute<
      GetDomainByCodeQuery,
      Readonly<DomainProperties> | null
    >(new GetDomainByCodeQuery(domainCode));
    if (!domain) {
      throw new NotFoundException('Domain not found.');
    }

    const role = await this.queryBus.execute<
      GetRoleByIdQuery,
      Readonly<RoleProperties> | null
    >(new GetRoleByIdQuery(roleId));
    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    return { domainCode: domain.code, roleId: role.id, roleCode: role.code };
  }

  private async syncRolePermissions(
    roleCode: string,
    domain: string,
    newPermissions: EndpointProperties[],
    existingPermissions: string[][],
  ): Promise<void> {
    // 转换新权限为 Casbin 策略格式
    const newPermSet = new Set(
      newPermissions.map((perm) =>
        JSON.stringify([roleCode, perm.resource, perm.action, domain, 'allow']),
      ),
    );

    const existingPermSet = new Set(
      existingPermissions.map((perm) => JSON.stringify(perm)),
    );

    // 删除在新权限中不存在的现有权限
    for (const perm of existingPermissions) {
      if (!newPermSet.has(JSON.stringify(perm))) {
        await this.authZRBACService.enforcer.removeFilteredPolicy(
          0,
          roleCode,
          perm[1],
          perm[2],
          domain,
          'allow',
        );
      }
    }

    // 添加不存在的新权限
    for (const perm of newPermissions) {
      const permArray = [roleCode, perm.resource, perm.action, domain, 'allow'];
      if (!existingPermSet.has(JSON.stringify(permArray))) {
        await this.authZRBACService.enforcer.addPermissionForUser(
          roleCode,
          perm.resource,
          perm.action,
          domain,
          'allow',
        );
      }
    }
  }
}
