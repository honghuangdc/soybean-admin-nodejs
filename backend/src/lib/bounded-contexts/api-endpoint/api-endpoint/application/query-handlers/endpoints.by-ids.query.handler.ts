import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ApiEndpointReadRepoPortToken } from '../../constants';
import { EndpointProperties } from '../../domain/endpoint.read.model';
import { ApiEndpointReadRepoPort } from '../../ports/api-endpoint.read.repo-port';
import { FindEndpointsByIdsQuery } from '../../queries/endpoints.by-ids.query';

@QueryHandler(FindEndpointsByIdsQuery)
export class FindEndpointsByIdsQueryHandler
  implements IQueryHandler<FindEndpointsByIdsQuery, EndpointProperties[]>
{
  @Inject(ApiEndpointReadRepoPortToken)
  private readonly repository: ApiEndpointReadRepoPort;

  async execute(query: FindEndpointsByIdsQuery): Promise<EndpointProperties[]> {
    return this.repository.findEndpointsByIds(query.ids);
  }
}
