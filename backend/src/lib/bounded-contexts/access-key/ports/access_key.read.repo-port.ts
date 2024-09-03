import { PaginationResult } from '@src/shared/prisma/pagination';

import { AccessKeyProperties } from '../domain/access_key.read.model';
import { PageAccessKeysQuery } from '../queries/page-access_key.query';

export interface AccessKeyReadRepoPort {
  getAccessKeyById(id: string): Promise<Readonly<AccessKeyProperties> | null>;

  pageAccessKeys(
    query: PageAccessKeysQuery,
  ): Promise<PaginationResult<AccessKeyProperties>>;
}
