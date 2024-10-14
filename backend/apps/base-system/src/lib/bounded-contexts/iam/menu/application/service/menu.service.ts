import { Inject, Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { MenuReadRepoPortToken } from '@app/base-system/lib/bounded-contexts/iam/menu/constants';
import { MenuReadRepoPort } from '@app/base-system/lib/bounded-contexts/iam/menu/ports/menu.read.repo-port';

import { ROOT_ROUTE_PID } from '@lib/shared/prisma/db.constant';

import { MenuProperties } from '../../domain/menu.read.model';
import { MenusByRoleCodeAndDomainQuery } from '../../queries/menus.by-role_code&domain.query';
import { MenuRoute, UserRoute } from '../dto/route.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(MenuReadRepoPortToken)
    private readonly repository: MenuReadRepoPort,
  ) {}

  async getUserRoutes(roleCode: string[], domain: string): Promise<UserRoute> {
    const userRoutes = await this.queryBus.execute<
      MenusByRoleCodeAndDomainQuery,
      Readonly<MenuProperties[]> | []
    >(new MenusByRoleCodeAndDomainQuery(roleCode, domain));
    if (userRoutes.length > 0) {
      return {
        routes: buildMenuTree(userRoutes),
        home: 'home',
      };
    }
    return { home: '', routes: [] };
  }

  async getConstantRoutes(): Promise<MenuRoute[]> {
    const constantMenus = await this.repository.getConstantRoutes();

    return constantMenus.map((menu) => ({
      name: menu.menuName,
      path: menu.routePath,
      component: menu.component,
      meta: {
        title: menu.menuName,
        i18nKey: menu.i18nKey,
        constant: menu.constant,
        hideInMenu: menu.hideInMenu,

        keepAlive: menu.keepAlive,
        icon: menu.icon,
        order: menu.order,
        href: menu.href,
        activeMenu: menu.activeMenu,
        multiTab: menu.multiTab,
      },
    }));
  }
}

function buildMenuTree(
  menus: ReadonlyArray<MenuProperties>,
  pid = ROOT_ROUTE_PID,
): MenuRoute[] {
  const menuMap = new Map<number, MenuProperties[]>();

  menus.forEach((menu) => {
    const list = menuMap.get(menu.pid) || [];
    list.push(menu);
    menuMap.set(menu.pid, list);
  });

  const children = menuMap.get(pid) || [];

  children.sort((a, b) => a.order - b.order);

  return children.map((menu) => ({
    name: menu.routeName,
    path: menu.routePath,
    component: menu.component,
    meta: {
      title: menu.menuName,
      i18nKey: menu.i18nKey,
      keepAlive: menu.keepAlive,
      constant: menu.constant,
      icon: menu.icon,
      order: menu.order,
      href: menu.href,
      hideInMenu: menu.hideInMenu,
      activeMenu: menu.activeMenu,
      multiTab: menu.multiTab,
    },
    children: buildMenuTree(menus, menu.id),
  }));
}
