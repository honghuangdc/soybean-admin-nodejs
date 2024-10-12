import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { LoginLogReadRepoPortToken } from '../../constants';
import { LoginLogProperties } from '../../domain/login-log.read.model';
import { LoginLogReadRepoPort } from '../../ports/login-log.read.repo-port';
import { PageLoginLogsQuery } from '../../queries/page-login-logs.query';

@QueryHandler(PageLoginLogsQuery)
export class PageLoginLogsQueryHandler
  implements
    IQueryHandler<PageLoginLogsQuery, PaginationResult<LoginLogProperties>>
{
  @Inject(LoginLogReadRepoPortToken)
  private readonly repository: LoginLogReadRepoPort;

  async execute(
    query: PageLoginLogsQuery,
  ): Promise<PaginationResult<LoginLogProperties>> {
    return this.repository.pageLoginLogs(query);
  }
}
