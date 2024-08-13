import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { MenuDeleteCommand } from '../../commands/menu-delete.command';
import { MenuReadRepoPortToken, MenuWriteRepoPortToken } from '../../constants';
import { Menu } from '../../domain/menu.model';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenuWriteRepoPort } from '../../ports/menu.write.repo-port';

@CommandHandler(MenuDeleteCommand)
export class MenuDeleteHandler
  implements ICommandHandler<MenuDeleteCommand, void>
{
  constructor(private readonly publisher: EventPublisher) {}
  @Inject(MenuWriteRepoPortToken)
  private readonly menuWriteRepository: MenuWriteRepoPort;
  @Inject(MenuReadRepoPortToken)
  private readonly menuReadRepoPort: MenuReadRepoPort;

  async execute(command: MenuDeleteCommand) {
    const existingMenu = await this.menuReadRepoPort.getMenuById(command.id);

    if (!existingMenu) {
      throw new BadRequestException(
        `A menu with the specified ID does not exist.`,
      );
    }

    const childrenMenuCount = await this.menuReadRepoPort.getChildrenMenuCount(
      command.id,
    );

    if (childrenMenuCount > 0) {
      throw new BadRequestException(
        `Cannot delete the menu with ID ${command.id} because it has sub-menus. Please delete the sub-menus first.`,
      );
    }

    const menu = Menu.fromProp(existingMenu);
    await this.menuWriteRepository.deleteById(menu.id);
    await menu.deleted();
    this.publisher.mergeObjectContext(menu);
    menu.commit();
  }
}
