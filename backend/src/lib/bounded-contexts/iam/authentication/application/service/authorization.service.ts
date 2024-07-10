import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { AuthZRBACService } from '@src/infra/casbin';
import { EndpointProperties } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/domain/endpoint.read-model';
import { FindEndpointsByIdsQuery } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/queries/endpoints.by-ids.query';
import { DomainProperties } from '@src/lib/bounded-contexts/iam/domain/domain/domain-read.model';
import { GetDomainByCodeQuery } from '@src/lib/bounded-contexts/iam/domain/queries/domain.by-id.query';
import { RoleProperties } from '@src/lib/bounded-contexts/iam/role/domain/role.read-model';
import { GetRoleByIdQuery } from '@src/lib/bounded-contexts/iam/role/queries/role.by-id.query';

import { RoleAssignPermissionCommand } from '../../commands/role-assign-permission.command';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authZRBACService: AuthZRBACService,
  ) {}

  async assignPermission(command: RoleAssignPermissionCommand) {
    const domain = await this.queryBus.execute<
      GetDomainByCodeQuery,
      Readonly<DomainProperties> | null
    >(new GetDomainByCodeQuery(command.domain));
    if (!domain) {
      throw new NotFoundException('Domain not found.');
    }

    const role = await this.queryBus.execute<
      GetRoleByIdQuery,
      Readonly<RoleProperties> | null
    >(new GetRoleByIdQuery(command.roleId));
    if (!role) {
      throw new NotFoundException('Role not found.');
    }

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
        role.code,
        '',
        '',
        domain.code,
      );

    await this.syncRolePermissions(
      role.code,
      domain.code,
      permissions,
      existingPermissions,
    );
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
