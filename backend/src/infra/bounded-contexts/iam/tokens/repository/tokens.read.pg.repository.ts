import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/shared/prisma/prisma.service';

import { TokensReadModel } from '@src/lib/bounded-contexts/iam/tokens/domain/tokens.read.model';
import { TokensReadRepoPort } from '@src/lib/bounded-contexts/iam/tokens/ports/tokens.read.repo-port';

@Injectable()
export class TokensReadRepository implements TokensReadRepoPort {
  constructor(private prisma: PrismaService) {}

  async findTokensByRefreshToken(
    refreshToken: string,
  ): Promise<TokensReadModel | null> {
    return this.prisma.sysTokens.findFirst({
      where: { refreshToken },
    });
  }
}
