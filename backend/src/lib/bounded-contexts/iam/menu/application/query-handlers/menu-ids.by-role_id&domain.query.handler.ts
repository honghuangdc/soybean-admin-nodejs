import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenuIdsByRoleIdAndDomainQuery } from '../../queries/menu-ids.by-role_id&domain.query';

@QueryHandler(MenuIdsByRoleIdAndDomainQuery)
export class MenuIdsByRoleIdAndDomainQueryHandler
  implements IQueryHandler<MenuIdsByRoleIdAndDomainQuery, number[]>
{
  @Inject(MenuReadRepoPortToken)
  private readonly repository: MenuReadRepoPort;

  async execute(query: MenuIdsByRoleIdAndDomainQuery): Promise<number[]> {
    return this.repository
      .findMenusByRoleId(query.roleId, query.domain)
      .then((menus) => menus.map((menu) => menu.id));
  }
}
