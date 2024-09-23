import { PaginationResult } from '@app/shared/prisma/pagination';

import { OperationLogProperties } from '../domain/operation-log.read.model';
import { PageOperationLogsQuery } from '../queries/page-operation-logs.query';

export interface OperationLogReadRepoPort {
  pageOperationLogs(
    query: PageOperationLogsQuery,
  ): Promise<PaginationResult<OperationLogProperties>>;
}
