import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { LoginLogProperties } from '@app/base-system/lib/bounded-contexts/log-audit/login-log/domain/login-log.read.model';
import { LoginLogReadRepoPort } from '@app/base-system/lib/bounded-contexts/log-audit/login-log/ports/login-log.read.repo-port';
import { PageLoginLogsQuery } from '@app/base-system/lib/bounded-contexts/log-audit/login-log/queries/page-login-logs.query';

import { PaginationResult } from '@lib/shared/prisma/pagination';
import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class LoginLogReadRepository implements LoginLogReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async pageLoginLogs(
    query: PageLoginLogsQuery,
  ): Promise<PaginationResult<LoginLogProperties>> {
    const where: Prisma.SysLoginLogWhereInput = {};

    if (query.username) {
      where.username = {
        contains: query.username,
      };
    }

    if (query.domain) {
      where.domain = query.domain;
    }

    if (query.address) {
      where.address = {
        contains: query.address,
      };
    }

    if (query.type) {
      where.type = query.type;
    }

    const loginLogs = await this.prisma.sysLoginLog.findMany({
      where: where,
      skip: (query.current - 1) * query.size,
      take: query.size,
      orderBy: [
        {
          loginTime: 'desc',
        },
      ],
    });

    const total = await this.prisma.sysLoginLog.count({ where: where });

    return new PaginationResult<LoginLogProperties>(
      query.current,
      query.size,
      total,
      loginLogs,
    );
  }
}
