import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { ApiEndpointReadRepoPortToken } from '../../constants';
import { EndpointProperties } from '../../domain/endpoint.read.model';
import { ApiEndpointReadRepoPort } from '../../ports/api-endpoint.read.repo-port';
import { PageEndpointsQuery } from '../../queries/page-endpoints.query';

@QueryHandler(PageEndpointsQuery)
export class PageEndpointsQueryHandler
  implements
    IQueryHandler<PageEndpointsQuery, PaginationResult<EndpointProperties>>
{
  @Inject(ApiEndpointReadRepoPortToken)
  private readonly repository: ApiEndpointReadRepoPort;

  async execute(
    query: PageEndpointsQuery,
  ): Promise<PaginationResult<EndpointProperties>> {
    return this.repository.pageEndpoints(query);
  }
}
