import { Injectable } from '@nestjs/common';

import { ApiEndpoint } from '@app/base-system/lib/bounded-contexts/api-endpoint/api-endpoint/domain/api-endpoint.model';
import { ApiEndpointWriteRepoPort } from '@app/base-system/lib/bounded-contexts/api-endpoint/api-endpoint/ports/api-endpoint.write.repo-port';

import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class ApiEndpointWriteRepository implements ApiEndpointWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async save(endpoints: ApiEndpoint[]): Promise<void> {
    const existingEndpoints = await this.prisma.sysEndpoint.findMany();
    const existingIds = existingEndpoints.map((ep) => ep.id);
    const newIds = endpoints.map((ep) => ep.id);
    const idsToDelete = existingIds.filter((id) => !newIds.includes(id));

    const upsertPromises = endpoints.map((endpoint) => {
      return this.prisma.sysEndpoint.upsert({
        where: { id: endpoint.id },
        update: {
          path: endpoint.path,
          method: endpoint.method,
          action: endpoint.action,
          resource: endpoint.resource,
          controller: endpoint.controller,
          summary: endpoint.summary,
        },
        create: endpoint,
      });
    });

    const deletePromise = this.prisma.sysEndpoint.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });

    await this.prisma.$transaction([...upsertPromises, deletePromise]);
  }
}
