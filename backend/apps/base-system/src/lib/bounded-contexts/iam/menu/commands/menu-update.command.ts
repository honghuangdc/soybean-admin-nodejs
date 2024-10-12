import { ICommand } from '@nestjs/cqrs';
import { MenuType, Status } from '@prisma/client';

import { MenuCreateCommand } from './menu-create.command';

export class MenuUpdateCommand extends MenuCreateCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly menuName: string,
    readonly menuType: MenuType,
    readonly iconType: number | null,
    readonly icon: string | null,
    readonly routeName: string,
    readonly routePath: string,
    readonly component: string,
    readonly pathParam: string | null,
    readonly status: Status,
    readonly activeMenu: string | null,
    readonly hideInMenu: boolean | null,
    readonly pid: number,
    readonly order: number,
    readonly i18nKey: string | null,
    readonly keepAlive: boolean | null,
    readonly constant: boolean,
    readonly href: string | null,
    readonly multiTab: boolean | null,
    readonly uid: string,
  ) {
    super(
      menuName,
      menuType,
      iconType,
      icon,
      routeName,
      routePath,
      component,
      pathParam,
      status,
      activeMenu,
      hideInMenu,
      pid,
      order,
      i18nKey,
      keepAlive,
      constant,
      href,
      multiTab,
      uid,
    );
  }
}
