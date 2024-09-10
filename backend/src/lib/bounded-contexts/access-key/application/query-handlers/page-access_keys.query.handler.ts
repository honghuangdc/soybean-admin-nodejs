import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@src/shared/prisma/pagination';

import { AccessKeyReadRepoPortToken } from '../../constants';
import { AccessKeyProperties } from '../../domain/access_key.read.model';
import { AccessKeyReadRepoPort } from '../../ports/access_key.read.repo-port';
import { PageAccessKeysQuery } from '../../queries/page-access_key.query';

@QueryHandler(PageAccessKeysQuery)
export class PageAccessKeysQueryHandler
  implements
    IQueryHandler<PageAccessKeysQuery, PaginationResult<AccessKeyProperties>>
{
  @Inject(AccessKeyReadRepoPortToken)
  private readonly repository: AccessKeyReadRepoPort;

  async execute(
    query: PageAccessKeysQuery,
  ): Promise<PaginationResult<AccessKeyProperties>> {
    return this.repository.pageAccessKeys(query);
  }
}
