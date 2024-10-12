import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RoleReadRepoPortToken } from '../../constants';
import { RoleProperties } from '../../domain/role.read.model';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { FindRoleByIdQuery } from '../../queries/role.by-id.query';

@QueryHandler(FindRoleByIdQuery)
export class FindRoleByIdQueryHandler
  implements IQueryHandler<FindRoleByIdQuery, Readonly<RoleProperties> | null>
{
  @Inject(RoleReadRepoPortToken) private readonly repository: RoleReadRepoPort;

  async execute(
    query: FindRoleByIdQuery,
  ): Promise<Readonly<RoleProperties> | null> {
    return this.repository.getRoleById(query.id);
  }
}
