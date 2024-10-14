import { Module } from '@nestjs/common';

import {
  DomainReadRepoPortToken,
  DomainWriteRepoPortToken,
} from '@app/base-system/lib/bounded-contexts/iam/domain/constants';
import { DomainModule } from '@app/base-system/lib/bounded-contexts/iam/domain/domain.module';

import { DomainReadRepository } from './repository/domain.read.pg.repository';
import { DomainWriteRepository } from './repository/domain.write.pg.repository';

const providers = [
  {
    provide: DomainReadRepoPortToken,
    useClass: DomainReadRepository,
  },
  {
    provide: DomainWriteRepoPortToken,
    useClass: DomainWriteRepository,
  },
];

@Module({
  imports: [
    DomainModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [DomainModule],
})
export class DomainInfraModule {}
