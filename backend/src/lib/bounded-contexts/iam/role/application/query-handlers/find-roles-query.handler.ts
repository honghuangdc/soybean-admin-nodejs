import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RoleReadRepoPortToken } from '../../constants';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { RoleCodesByUserIdQuery } from '../../queries/role_codes_by_user_id_query';

@QueryHandler(RoleCodesByUserIdQuery)
export class FindRolesQueryHandler
  implements IQueryHandler<RoleCodesByUserIdQuery, Set<string>>
{
  @Inject(RoleReadRepoPortToken) private readonly repository: RoleReadRepoPort;

  async execute(query: RoleCodesByUserIdQuery): Promise<Set<string>> {
    return this.repository.findRolesByUserId(query.userId);
  }
}
