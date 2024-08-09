import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenuIdsByRoleCodeAndDomainQuery } from '../../queries/menu-ids.by-role_code&domain.query';

@QueryHandler(MenuIdsByRoleCodeAndDomainQuery)
export class MenuIdsByRoleCodeAndDomainQueryHandler
  implements IQueryHandler<MenuIdsByRoleCodeAndDomainQuery, number[]>
{
  @Inject(MenuReadRepoPortToken)
  private readonly repository: MenuReadRepoPort;

  async execute(query: MenuIdsByRoleCodeAndDomainQuery): Promise<number[]> {
    return this.repository
      .findMenusByRoleCode(Array.of(query.roleCode), query.domain)
      .then((menus) => menus.map((menu) => menu.id));
  }
}
