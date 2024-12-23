import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  AccessKeyProperties,
  AccessKeyReadModel,
} from '@app/base-system/lib/bounded-contexts/access-key/domain/access_key.read.model';
import { AccessKeyReadRepoPort } from '@app/base-system/lib/bounded-contexts/access-key/ports/access_key.read.repo-port';
import { PageAccessKeysQuery } from '@app/base-system/lib/bounded-contexts/access-key/queries/page-access_key.query';

import { PaginationResult } from '@lib/shared/prisma/pagination';
import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class AccessKeyReadPostgresRepository implements AccessKeyReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async pageAccessKeys(
    query: PageAccessKeysQuery,
  ): Promise<PaginationResult<AccessKeyReadModel>> {
    const where: Prisma.SysAccessKeyWhereInput = {};

    if (query.domain) {
      where.domain = {
        contains: query.domain,
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const accessKeys = await this.prisma.sysAccessKey.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      select: {
        id: true,
        domain: true,
        AccessKeyID: true,
        status: true,
        description: true,
        createdAt: true,
        createdBy: true,
      },
    });

    const total = await this.prisma.sysAccessKey.count({ where: where });

    return new PaginationResult<AccessKeyReadModel>(
      query.current,
      query.size,
      total,
      accessKeys,
    );
  }

  async getAccessKeyById(
    id: string,
  ): Promise<Readonly<AccessKeyProperties> | null> {
    return this.prisma.sysAccessKey.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<AccessKeyProperties[]> {
    return this.prisma.sysAccessKey.findMany();
  }
}
