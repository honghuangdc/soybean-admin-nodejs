import { PaginationResult } from '@lib/shared/prisma/pagination';

import { LoginLogProperties } from '../domain/login-log.read.model';
import { PageLoginLogsQuery } from '../queries/page-login-logs.query';

export interface LoginLogReadRepoPort {
  pageLoginLogs(
    query: PageLoginLogsQuery,
  ): Promise<PaginationResult<LoginLogProperties>>;
}
