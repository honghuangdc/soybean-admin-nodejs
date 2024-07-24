import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenuIdsByRoleIdQuery } from '../../queries/menu-ids.by-id.query';

@QueryHandler(MenuIdsByRoleIdQuery)
export class MenuIdsByRoleIdQueryHandler
  implements IQueryHandler<MenuIdsByRoleIdQuery, number[]>
{
  @Inject(MenuReadRepoPortToken)
  private readonly repository: MenuReadRepoPort;

  async execute(query: MenuIdsByRoleIdQuery): Promise<number[]> {
    return this.repository.findMenuIdsByRoleId(query.roleId, query.domain);
  }
}
