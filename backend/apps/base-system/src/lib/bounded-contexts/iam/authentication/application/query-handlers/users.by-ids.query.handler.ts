import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserReadRepoPortToken } from '../../constants';
import { UserProperties } from '../../domain/user.read.model';
import { UserReadRepoPort } from '../../ports/user.read.repo-port';
import { UsersByIdsQuery } from '../../queries/users.by-ids.query';

@QueryHandler(UsersByIdsQuery)
export class UsersByIdsQueryHandler
  implements IQueryHandler<UsersByIdsQuery, UserProperties[]>
{
  @Inject(UserReadRepoPortToken)
  private readonly repository: UserReadRepoPort;

  async execute(query: UsersByIdsQuery): Promise<UserProperties[]> {
    return this.repository.findUsersByIds(query.ids);
  }
}
