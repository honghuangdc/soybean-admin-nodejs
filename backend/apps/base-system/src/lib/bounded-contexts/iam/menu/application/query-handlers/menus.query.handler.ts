import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { buildTree } from '@lib/utils/tree.util';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuTreeProperties } from '../../domain/menu.read.model';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenusQuery } from '../../queries/menus.query';

@QueryHandler(MenusQuery)
export class MenusQueryHandler
  implements IQueryHandler<MenusQuery, Readonly<MenuTreeProperties[]> | []>
{
  @Inject(MenuReadRepoPortToken) private readonly repository: MenuReadRepoPort;

  async execute(_: MenusQuery): Promise<Readonly<MenuTreeProperties[]> | []> {
    const menus = await this.repository.findAll();
    return buildTree<MenuTreeProperties>(menus, 'pid', 'id', 'order');
  }
}
