import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { OperationLogReadRepoPortToken } from '../../constants';
import { OperationLogProperties } from '../../domain/operation-log.read.model';
import { OperationLogReadRepoPort } from '../../ports/operation-log.read.repo-port';
import { PageOperationLogsQuery } from '../../queries/page-operation-logs.query';

@QueryHandler(PageOperationLogsQuery)
export class PageOperationLogsQueryHandler
  implements
    IQueryHandler<
      PageOperationLogsQuery,
      PaginationResult<OperationLogProperties>
    >
{
  @Inject(OperationLogReadRepoPortToken)
  private readonly repository: OperationLogReadRepoPort;

  async execute(
    query: PageOperationLogsQuery,
  ): Promise<PaginationResult<OperationLogProperties>> {
    return this.repository.pageOperationLogs(query);
  }
}
