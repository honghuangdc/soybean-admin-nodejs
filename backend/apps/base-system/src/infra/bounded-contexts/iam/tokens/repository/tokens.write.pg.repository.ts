import { Injectable } from '@nestjs/common';

import { TokensEntity } from '@app/base-system/lib/bounded-contexts/iam/tokens/domain/tokens.entity';
import { TokensWriteRepoPort } from '@app/base-system/lib/bounded-contexts/iam/tokens/ports/tokens.write.repo-port';

import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class TokensWriteRepository implements TokensWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async save(tokens: TokensEntity): Promise<void> {
    await this.prisma.sysTokens.create({
      data: tokens,
    });
  }

  async updateTokensStatus(
    refreshToken: string,
    status: string,
  ): Promise<void> {
    await this.prisma.sysTokens.update({
      where: {
        refreshToken: refreshToken,
      },
      data: {
        status: status,
      },
    });
  }
}
