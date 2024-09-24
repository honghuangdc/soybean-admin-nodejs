import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { UserReadRepoPortToken } from '../../constants';
import { UserProperties } from '../../domain/user.read.model';
import { UserReadRepoPort } from '../../ports/user.read.repo-port';
import { PageUsersQuery } from '../../queries/page-users.query';

@QueryHandler(PageUsersQuery)
export class PageUsersQueryHandler
  implements IQueryHandler<PageUsersQuery, PaginationResult<UserProperties>>
{
  @Inject(UserReadRepoPortToken) private readonly repository: UserReadRepoPort;

  async execute(
    query: PageUsersQuery,
  ): Promise<PaginationResult<UserProperties>> {
    return this.repository.pageUsers(query);
  }
}
