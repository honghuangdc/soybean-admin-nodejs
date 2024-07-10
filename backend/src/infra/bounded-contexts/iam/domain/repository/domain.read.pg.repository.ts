import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { DomainProperties } from '@src/lib/bounded-contexts/iam/domain/domain/domain-read.model';
import { DomainReadRepoPort } from '@src/lib/bounded-contexts/iam/domain/ports/domain.read.repo-port';
import { PageDomainsQuery } from '@src/lib/bounded-contexts/iam/domain/queries/page-domains.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class DomainReadRepository implements DomainReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async pageDomains(
    query: PageDomainsQuery,
  ): Promise<PaginationResult<DomainProperties>> {
    const where: Prisma.SysDomainWhereInput = {};

    if (query.name) {
      where.name = {
        contains: query.name,
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const domains = await this.prisma.sysDomain.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });

    const total = await this.prisma.sysDomain.count({ where: where });

    return new PaginationResult<DomainProperties>(
      query.current,
      query.size,
      total,
      domains,
    );
  }

  async getDomainById(code: string): Promise<DomainProperties | null> {
    return this.prisma.sysDomain.findUnique({
      where: { code },
    });
  }

  async getDomainByCode(
    code: string,
  ): Promise<Readonly<DomainProperties> | null> {
    return this.prisma.sysDomain.findUnique({
      where: { code },
    });
  }
}
