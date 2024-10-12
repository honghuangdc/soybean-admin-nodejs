import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuProperties } from '../../domain/menu.read.model';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenusByIdsQuery } from '../../queries/menus.by-ids.query';

@QueryHandler(MenusByIdsQuery)
export class MenusByIdsQueryHandler
  implements IQueryHandler<MenusByIdsQuery, MenuProperties[]>
{
  @Inject(MenuReadRepoPortToken)
  private readonly repository: MenuReadRepoPort;

  async execute(query: MenusByIdsQuery): Promise<MenuProperties[]> {
    return this.repository.findMenusByIds(query.ids);
  }
}
