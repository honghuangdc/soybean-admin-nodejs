import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { OperationLogReadRepoPort } from '@src/lib/bounded-contexts/log-audit/operation-log/ports/operation-log.read.repo-port';
import { PageOperationLogsQuery } from '@src/lib/bounded-contexts/log-audit/operation-log/queries/page-operation-logs.query';
import { PaginationResult } from '@src/shared/prisma/pagination';
import { OperationLogProperties } from '@src/lib/bounded-contexts/log-audit/operation-log/domain/operation-log.read-model';
import { Prisma } from '@prisma/client';

@Injectable()
export class OperationLogReadRepository implements OperationLogReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async pageOperationLogs(
    query: PageOperationLogsQuery,
  ): Promise<PaginationResult<OperationLogProperties>> {
    const where: Prisma.SysOperationLogWhereInput = {};

    if (query.username) {
      where.username = {
        contains: query.username,
      };
    }

    if (query.domain) {
      where.domain = query.domain;
    }

    if (query.moduleName) {
      where.moduleName = {
        contains: query.moduleName,
      };
    }

    if (query.method) {
      where.method = query.method;
    }

    const operationLogs = await this.prisma.sysOperationLog.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });

    const total = await this.prisma.sysOperationLog.count({ where: where });

    return new PaginationResult<OperationLogProperties>(
      query.current,
      query.size,
      total,
      operationLogs,
    );
  }
}
