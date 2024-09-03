import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AccessKeyProperties } from '@src/lib/bounded-contexts/access-key/domain/access_key.read.model';
import { AccessKeyReadRepoPort } from '@src/lib/bounded-contexts/access-key/ports/access_key.read.repo-port';
import { PageAccessKeysQuery } from '@src/lib/bounded-contexts/access-key/queries/page-access_key.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class AccessKeyReadPostgresRepository implements AccessKeyReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async pageAccessKeys(
    query: PageAccessKeysQuery,
  ): Promise<PaginationResult<AccessKeyProperties>> {
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
    });

    const total = await this.prisma.sysAccessKey.count({ where: where });

    return new PaginationResult<AccessKeyProperties>(
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
}
