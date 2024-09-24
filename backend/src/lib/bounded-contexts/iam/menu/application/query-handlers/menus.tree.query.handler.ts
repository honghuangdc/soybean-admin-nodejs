import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { buildTree } from '@lib/utils/tree.util';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuTreeProperties } from '../../domain/menu.read.model';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenusTreeQuery } from '../../queries/menus.tree.query';

@QueryHandler(MenusTreeQuery)
export class MenusTreeQueryHandler
  implements IQueryHandler<MenusTreeQuery, Readonly<MenuTreeProperties[]> | []>
{
  @Inject(MenuReadRepoPortToken) private readonly repository: MenuReadRepoPort;

  async execute(
    query: MenusTreeQuery,
  ): Promise<Readonly<MenuTreeProperties[]> | []> {
    const menus = await this.repository.findAllConstantMenu(query.constant);
    return buildTree<MenuTreeProperties>(menus, 'pid', 'id', 'order');
  }
}
