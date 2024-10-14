import { Module } from '@nestjs/common';

import {
  TokensReadRepoPortToken,
  TokensWriteRepoPortToken,
} from '@app/base-system/lib/bounded-contexts/iam/tokens/constants';
import { TokensModule } from '@app/base-system/lib/bounded-contexts/iam/tokens/tokens.module';

import { TokensReadRepository } from './repository/tokens.read.pg.repository';
import { TokensWriteRepository } from './repository/tokens.write.pg.repository';

const providers = [
  {
    provide: TokensReadRepoPortToken,
    useClass: TokensReadRepository,
  },
  {
    provide: TokensWriteRepoPortToken,
    useClass: TokensWriteRepository,
  },
];

@Module({
  imports: [
    TokensModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [TokensModule],
})
export class TokensInfraModule {}
