import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { RoleReadRepoPortToken } from '../../constants';
import { RoleProperties } from '../../domain/role.read.model';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { PageRolesQuery } from '../../queries/page-roles.query';

@QueryHandler(PageRolesQuery)
export class PageRolesQueryHandler
  implements IQueryHandler<PageRolesQuery, PaginationResult<RoleProperties>>
{
  @Inject(RoleReadRepoPortToken) private readonly repository: RoleReadRepoPort;

  async execute(
    query: PageRolesQuery,
  ): Promise<PaginationResult<RoleProperties>> {
    return this.repository.pageRoles(query);
  }
}
