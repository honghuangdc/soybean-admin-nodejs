import { PaginationResult } from '@src/shared/prisma/pagination';

import { DomainProperties } from '../domain/domain-read.model';
import { PageDomainsQuery } from '../queries/page-domains.query';

export interface DomainReadRepoPort {
  pageDomains(
    query: PageDomainsQuery,
  ): Promise<PaginationResult<DomainProperties>>;

  getDomainById(code: string): Promise<DomainProperties | null>;

  getDomainByCode(code: string): Promise<Readonly<DomainProperties> | null>;
}
