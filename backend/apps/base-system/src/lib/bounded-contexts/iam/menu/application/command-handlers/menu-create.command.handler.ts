import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ROOT_ROUTE_PID } from '@lib/shared/prisma/db.constant';

import { MenuCreateCommand } from '../../commands/menu-create.command';
import { MenuReadRepoPortToken, MenuWriteRepoPortToken } from '../../constants';
import { Menu } from '../../domain/menu.model';
import { MenuCreateProperties } from '../../domain/menu.read.model';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenuWriteRepoPort } from '../../ports/menu.write.repo-port';

@CommandHandler(MenuCreateCommand)
export class MenuCreateHandler
  implements ICommandHandler<MenuCreateCommand, void>
{
  @Inject(MenuWriteRepoPortToken)
  private readonly menuWriteRepository: MenuWriteRepoPort;
  @Inject(MenuReadRepoPortToken)
  private readonly menuReadRepoPort: MenuReadRepoPort;

  async execute(command: MenuCreateCommand) {
    if (command.pid !== ROOT_ROUTE_PID) {
      const parentMenu = await this.menuReadRepoPort.getMenuById(command.pid);

      if (!parentMenu) {
        throw new BadRequestException(
          `Parent menu with code ${command.pid} does not exist.`,
        );
      }
    }

    const menuCreateProperties: MenuCreateProperties = {
      //Tips ddd中id最好提前生成以便聚合处理
      //但此处写死-1是因为菜单基本也就只有开发阶段有大的新增和变动
      //后台管理系统即便有这个功能动态添加了也没有实际的组件与之对应 意义不大
      id: -1,
      menuName: command.menuName,
      menuType: command.menuType,
      routeName: command.routeName,
      routePath: command.routePath,
      component: command.component,
      status: command.status,
      pid: command.pid,
      order: command.order,
      constant: command.constant,
      createdAt: new Date(),
      createdBy: command.uid,
      iconType: command.iconType,
      icon: command.icon,
      pathParam: command.pathParam,
      activeMenu: command.activeMenu,
      hideInMenu: command.hideInMenu,
      i18nKey: command.i18nKey,
      keepAlive: command.keepAlive,
      href: command.href,
      multiTab: command.multiTab,
    };

    const menu = Menu.fromCreate(menuCreateProperties);
    await this.menuWriteRepository.save(menu);
  }
}
