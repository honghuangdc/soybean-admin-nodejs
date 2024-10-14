import { Module } from '@nestjs/common';

import {
  OperationLogReadRepoPortToken,
  OperationLogWriteRepoPortToken,
} from '@app/base-system/lib/bounded-contexts/log-audit/operation-log/constants';
import { OperationLogModule } from '@app/base-system/lib/bounded-contexts/log-audit/operation-log/operation-log.module';

import { OperationLogReadRepository } from './repository/operation-log.read.pg.repository';
import { OperationLogWriteRepository } from './repository/operation-log.write.pg.repository';

const providers = [
  {
    provide: OperationLogReadRepoPortToken,
    useClass: OperationLogReadRepository,
  },
  {
    provide: OperationLogWriteRepoPortToken,
    useClass: OperationLogWriteRepository,
  },
];

@Module({
  imports: [
    OperationLogModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [OperationLogModule],
})
export class OperationLogInfraModule {}
