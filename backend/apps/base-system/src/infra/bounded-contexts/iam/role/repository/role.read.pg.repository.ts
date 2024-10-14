import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { RoleProperties } from '@app/base-system/lib/bounded-contexts/iam/role/domain/role.read.model';
import { RoleReadRepoPort } from '@app/base-system/lib/bounded-contexts/iam/role/ports/role.read.repo-port';
import { PageRolesQuery } from '@app/base-system/lib/bounded-contexts/iam/role/queries/page-roles.query';

import { PaginationResult } from '@lib/shared/prisma/pagination';
import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class RoleReadPostgresRepository implements RoleReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async findRolesByUserId(userId: string): Promise<Set<string>> {
    const userRoles = await this.prisma.sysUserRole.findMany({
      where: {
        userId: userId,
      },
      select: {
        roleId: true,
      },
    });

    const roleIds = userRoles.map((userRole) => userRole.roleId);

    const roles = await this.prisma.sysRole.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
      select: {
        code: true,
      },
    });

    return new Set(roles.map((role) => role.code));
  }

  async pageRoles(
    query: PageRolesQuery,
  ): Promise<PaginationResult<RoleProperties>> {
    const where: Prisma.SysRoleWhereInput = {};

    if (query.code) {
      where.code = {
        contains: query.code,
      };
    }

    if (query.name) {
      where.name = {
        contains: query.name,
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const roles = await this.prisma.sysRole.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
    });

    const total = await this.prisma.sysRole.count({ where: where });

    return new PaginationResult<RoleProperties>(
      query.current,
      query.size,
      total,
      roles,
    );
  }

  async getRoleByCode(code: string): Promise<Readonly<RoleProperties> | null> {
    return this.prisma.sysRole.findUnique({
      where: { code },
    });
  }

  async getRoleById(id: string): Promise<Readonly<RoleProperties> | null> {
    return this.prisma.sysRole.findUnique({
      where: { id },
    });
  }
}
