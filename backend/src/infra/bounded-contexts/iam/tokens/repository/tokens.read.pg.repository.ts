import { Injectable } from '@nestjs/common';

import { TokensReadRepoPort } from '@src/lib/bounded-contexts/iam/tokens/ports/tokens.read.repo-port';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class TokensReadRepository implements TokensReadRepoPort {
  constructor(private prisma: PrismaService) {}
}
