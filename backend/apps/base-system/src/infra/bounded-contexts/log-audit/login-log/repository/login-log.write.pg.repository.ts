import { Injectable } from '@nestjs/common';

import { LoginLogEntity } from '@app/base-system/lib/bounded-contexts/log-audit/login-log/domain/login-log.entity';
import { LoginLogWriteRepoPort } from '@app/base-system/lib/bounded-contexts/log-audit/login-log/ports/login-log.write.repo-port';

import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class LoginLogWriteRepository implements LoginLogWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async save(loginLog: LoginLogEntity): Promise<void> {
    await this.prisma.sysLoginLog.create({
      data: {
        userId: loginLog.userId,
        username: loginLog.username,
        domain: loginLog.domain,
        loginTime: new Date(),
        ip: loginLog.ip,
        port: loginLog.port,
        address: loginLog.address,
        userAgent: loginLog.userAgent,
        requestId: loginLog.requestId,
        type: loginLog.type,
        createdAt: new Date(),
        createdBy: loginLog.userId,
      },
    });
  }
}
