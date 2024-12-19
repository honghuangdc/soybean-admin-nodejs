import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { DomainReadRepoPortToken } from '../../constants';
import { DomainProperties } from '../../domain/domain.read.model';
import { DomainReadRepoPort } from '../../ports/domain.read.repo-port';
import { PageDomainsQuery } from '../../queries/page-domains.query';

@QueryHandler(PageDomainsQuery)
export class PageDomainsQueryHandler
  implements IQueryHandler<PageDomainsQuery, PaginationResult<DomainProperties>>
{
  @Inject(DomainReadRepoPortToken)
  private readonly repository: DomainReadRepoPort;

  async execute(
    query: PageDomainsQuery,
  ): Promise<PaginationResult<DomainProperties>> {
    return this.repository.pageDomains(query);
  }
}
