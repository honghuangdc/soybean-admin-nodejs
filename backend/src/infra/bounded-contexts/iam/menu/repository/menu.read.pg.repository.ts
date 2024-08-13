import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import {
  MenuProperties,
  MenuTreeProperties,
} from '@src/lib/bounded-contexts/iam/menu/domain/menu.read-model';
import { MenuReadRepoPort } from '@src/lib/bounded-contexts/iam/menu/ports/menu.read.repo-port';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class MenuReadPostgresRepository implements MenuReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async getChildrenMenuCount(id: number): Promise<number> {
    return this.prisma.sysMenu.count({
      where: {
        // TODO 类型对齐
        pid: String(id),
      },
    });
  }

  async getMenuById(id: number): Promise<Readonly<MenuProperties> | null> {
    return this.prisma.sysMenu.findUnique({
      where: { id },
    });
  }

  async findMenusByRoleCode(
    roleCode: string[],
    domain: string,
  ): Promise<Readonly<MenuProperties[]> | []> {
    const roles = await this.prisma.sysRole.findMany({
      where: {
        code: {
          in: roleCode,
        },
      },
      select: {
        id: true,
      },
    });

    const roleIds = roles.map((role) => role.id);

    const roleMenus = await this.prisma.sysRoleMenu.findMany({
      where: {
        roleId: { in: roleIds },
        domain: domain,
      },
      select: {
        menuId: true,
      },
    });

    const menuIds = roleMenus.map((rm) => rm.menuId);

    if (menuIds.length > 0) {
      const menus = await this.prisma.sysMenu.findMany({
        where: {
          id: { in: menuIds },
          status: Status.ENABLED,
        },
      });
      return menus;
    }

    return [];
  }

  async getConstantRoutes(): Promise<Readonly<MenuProperties[]> | []> {
    return this.prisma.sysMenu.findMany({
      where: {
        constant: true,
        status: Status.ENABLED,
      },
    });
  }

  async findAll(): Promise<MenuTreeProperties[] | []> {
    return this.prisma.sysMenu.findMany();
  }

  async findMenusByIds(ids: number[]): Promise<MenuProperties[]> {
    return this.prisma.sysMenu.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findMenuIdsByUserId(userId: string, domain: string): Promise<number[]> {
    const roleIds = await this.prisma.sysUserRole
      .findMany({
        where: {
          userId,
        },
        select: {
          roleId: true,
        },
      })
      .then((results) => results.map((item) => item.roleId));

    return this.prisma.sysRoleMenu
      .findMany({
        where: {
          roleId: {
            in: roleIds,
          },
          domain,
        },
        select: {
          menuId: true,
        },
      })
      .then((results) => results.map((item) => item.menuId));
  }
}
