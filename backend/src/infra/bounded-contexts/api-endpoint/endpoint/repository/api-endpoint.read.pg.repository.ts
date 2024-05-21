import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { ApiEndpointReadRepoPort } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/ports/api-endpoint.read.repo-port';
import { PageEndpointsQuery } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/queries/page-endpoints.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { EndpointProperties } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/domain/endpoint.read-model';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApiEndpointReadRepository implements ApiEndpointReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async pageEndpoints(
    query: PageEndpointsQuery,
  ): Promise<PaginationResult<EndpointProperties>> {
    const where: Prisma.SysEndpointWhereInput = {};

    if (query.path) {
      where.path = {
        contains: query.path,
      };
    }

    if (query.method) {
      where.method = query.method;
    }

    if (query.action) {
      where.action = query.action;
    }

    if (query.resource) {
      where.resource = {
        contains: query.resource,
      };
    }

    const endpoints = await this.prisma.sysEndpoint.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      orderBy: [
        {
          createdAt: 'asc',
        },
        {
          controller: 'asc',
        },
        {
          path: 'asc',
        },
        {
          method: 'asc',
        },
        {
          action: 'asc',
        },
      ],
    });

    const total = await this.prisma.sysEndpoint.count({ where: where });

    return new PaginationResult<EndpointProperties>(
      query.current,
      query.size,
      total,
      endpoints,
    );
  }
}
