import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserReadRepoPortToken } from '../../constants';
import { UserReadRepoPort } from '../../ports/user.read.repo-port';
import { UserIdsByRoleIdQuery } from '../../queries/user-ids.by-role_id.query';

@QueryHandler(UserIdsByRoleIdQuery)
export class UserIdsByRoleIdQueryHandler
  implements IQueryHandler<UserIdsByRoleIdQuery, string[]>
{
  @Inject(UserReadRepoPortToken)
  private readonly repository: UserReadRepoPort;

  async execute(query: UserIdsByRoleIdQuery): Promise<string[]> {
    return this.repository.findUserIdsByRoleId(query.roleId);
  }
}
