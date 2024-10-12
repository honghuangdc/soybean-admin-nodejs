import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuProperties } from '../../domain/menu.read.model';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenusByRoleCodeAndDomainQuery } from '../../queries/menus.by-role_code&domain.query';

@QueryHandler(MenusByRoleCodeAndDomainQuery)
export class MenusByRoleCodeAndDomainQueryQueryHandler
  implements
    IQueryHandler<
      MenusByRoleCodeAndDomainQuery,
      Readonly<MenuProperties[]> | []
    >
{
  @Inject(MenuReadRepoPortToken) private readonly repository: MenuReadRepoPort;

  async execute(
    query: MenusByRoleCodeAndDomainQuery,
  ): Promise<Readonly<MenuProperties[]> | []> {
    return this.repository.findMenusByRoleCode(query.roleCode, query.domain);
  }
}
