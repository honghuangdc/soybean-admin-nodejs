import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { AccessKeyReadRepoPortToken } from '../../constants';
import { AccessKeyReadModel } from '../../domain/access_key.read.model';
import { AccessKeyReadRepoPort } from '../../ports/access_key.read.repo-port';
import { PageAccessKeysQuery } from '../../queries/page-access_key.query';

@QueryHandler(PageAccessKeysQuery)
export class PageAccessKeysQueryHandler
  implements
    IQueryHandler<PageAccessKeysQuery, PaginationResult<AccessKeyReadModel>>
{
  @Inject(AccessKeyReadRepoPortToken)
  private readonly repository: AccessKeyReadRepoPort;

  async execute(
    query: PageAccessKeysQuery,
  ): Promise<PaginationResult<AccessKeyReadModel>> {
    return this.repository.pageAccessKeys(query);
  }
}
