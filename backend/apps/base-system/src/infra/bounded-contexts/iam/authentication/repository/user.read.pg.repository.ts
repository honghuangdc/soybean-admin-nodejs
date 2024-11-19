import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserProperties } from '@app/base-system/lib/bounded-contexts/iam/authentication/domain/user.read.model';
import { UserReadRepoPort } from '@app/base-system/lib/bounded-contexts/iam/authentication/ports/user.read.repo-port';
import { PageUsersQuery } from '@app/base-system/lib/bounded-contexts/iam/authentication/queries/page-users.query';

import { PaginationResult } from '@lib/shared/prisma/pagination';
import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class UserReadRepository implements UserReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: string): Promise<UserProperties | null> {
    return this.prisma.sysUser.findUnique({
      where: { id },
    });
  }

  async findUserIdsByRoleId(roleId: string): Promise<string[]> {
    return this.prisma.sysUserRole
      .findMany({
        where: { roleId },
        select: {
          userId: true,
        },
      })
      .then((results) => results.map((item) => item.userId));
  }

  async findUsersByIds(ids: string[]): Promise<UserProperties[]> {
    return this.prisma.sysUser.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  private readonly USER_ESSENTIAL_FIELDS = {
    id: true,
    username: true,
    domain: true,
    avatar: true,
    email: true,
    phoneNumber: true,
    nickName: true,
    status: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    password: false,
  };

  async findUserByIdentifier(
    identifier: string,
  ): Promise<UserProperties | null> {
    return this.prisma.sysUser.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { phoneNumber: identifier },
        ],
      },
    });
  }

  async pageUsers(
    query: PageUsersQuery,
  ): Promise<PaginationResult<UserProperties>> {
    const where: Prisma.SysUserWhereInput = {};

    if (query.username) {
      where.username = {
        contains: query.username,
      };
    }

    if (query.nickName) {
      where.nickName = {
        contains: query.nickName,
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const users = await this.prisma.sysUser.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      select: this.USER_ESSENTIAL_FIELDS,
    });

    const total = await this.prisma.sysUser.count({ where: where });

    return new PaginationResult<UserProperties>(
      query.current,
      query.size,
      total,
      users,
    );
  }

  async getUserByUsername(
    username: string,
  ): Promise<Readonly<UserProperties> | null> {
    return this.prisma.sysUser.findUnique({
      where: { username },
    });
  }

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
}
