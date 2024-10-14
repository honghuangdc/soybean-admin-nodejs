import { Module } from '@nestjs/common';

import { AccessKeyModule } from '@app/base-system/lib/bounded-contexts/access-key/access_key.module';
import {
  AccessKeyReadRepoPortToken,
  AccessKeyWriteRepoPortToken,
} from '@app/base-system/lib/bounded-contexts/access-key/constants';

import { AccessKeyReadPostgresRepository } from './repository/access_key.read.pg.repository';
import { AccessKeyWritePostgresRepository } from './repository/access_key.write.pg.repository';

const providers = [
  {
    provide: AccessKeyReadRepoPortToken,
    useClass: AccessKeyReadPostgresRepository,
  },
  {
    provide: AccessKeyWriteRepoPortToken,
    useClass: AccessKeyWritePostgresRepository,
  },
];

@Module({
  imports: [
    AccessKeyModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [AccessKeyModule],
})
export class AccessKeyInfraModule {}
