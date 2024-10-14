import { Module } from '@nestjs/common';

import {
  RoleReadRepoPortToken,
  RoleWriteRepoPortToken,
} from '@app/base-system/lib/bounded-contexts/iam/role/constants';
import { RoleModule } from '@app/base-system/lib/bounded-contexts/iam/role/role.module';

import { RoleReadPostgresRepository } from './repository/role.read.pg.repository';
import { RoleWritePostgresRepository } from './repository/role.write.pg.repository';

const providers = [
  { provide: RoleReadRepoPortToken, useClass: RoleReadPostgresRepository },
  { provide: RoleWriteRepoPortToken, useClass: RoleWritePostgresRepository },
];

@Module({
  imports: [
    RoleModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [RoleModule],
})
export class RoleInfraModule {}
