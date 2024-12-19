import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ApiEndpointReadRepoPortToken } from '../../constants';
import {
  EndpointProperties,
  EndpointTreeProperties,
} from '../../domain/endpoint.read.model';
import { ApiEndpointReadRepoPort } from '../../ports/api-endpoint.read.repo-port';
import { EndpointsQuery } from '../../queries/endpoints.query';

@QueryHandler(EndpointsQuery)
export class EndpointsQueryHandler
  implements
    IQueryHandler<EndpointsQuery, Readonly<EndpointTreeProperties[]> | []>
{
  @Inject(ApiEndpointReadRepoPortToken)
  private readonly repository: ApiEndpointReadRepoPort;

  async execute(
    _: EndpointsQuery,
  ): Promise<Readonly<EndpointTreeProperties[]> | []> {
    const endpoints = await this.repository.findAllPermissionApi();
    return this.createEndpointTree(endpoints);
  }

  private createEndpointTree(
    endpoints: EndpointProperties[],
  ): EndpointTreeProperties[] {
    const tree: EndpointTreeProperties[] = [];

    endpoints.forEach((endpoint) => {
      let node = tree.find((n) => n.controller === endpoint.controller);
      if (!node) {
        node = {
          id: `controller-${endpoint.controller}`,
          path: '',
          method: '',
          action: '',
          resource: '',
          controller: endpoint.controller,
          summary: null,
          createdAt: new Date(),
          updatedAt: null,
          children: [],
        };
        tree.push(node);
      }
      node.children!.push({
        ...endpoint,
        children: [],
      });
    });

    return tree;
  }
}
