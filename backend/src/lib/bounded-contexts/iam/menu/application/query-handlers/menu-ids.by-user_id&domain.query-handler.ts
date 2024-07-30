import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MenuReadRepoPortToken } from '../../constants';
import { MenuReadRepoPort } from '../../ports/menu.read.repo-port';
import { MenuIdsByUserIdAndDomainQuery } from '../../queries/menu-ids.by-user_id&domain.query';

@QueryHandler(MenuIdsByUserIdAndDomainQuery)
export class MenuIdsByUserIdAndDomainQueryHandler
  implements IQueryHandler<MenuIdsByUserIdAndDomainQuery, number[]>
{
  @Inject(MenuReadRepoPortToken)
  private readonly repository: MenuReadRepoPort;

  async execute(query: MenuIdsByUserIdAndDomainQuery): Promise<number[]> {
    return this.repository.findMenuIdsByUserId(query.userId, query.domain);
  }
}
