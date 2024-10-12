import { Module } from '@nestjs/common';

import {
  MenuReadRepoPortToken,
  MenuWriteRepoPortToken,
} from 'apps/base-system/src/lib/bounded-contexts/iam/menu/constants';
import { MenuModule } from 'apps/base-system/src/lib/bounded-contexts/iam/menu/menu.module';

import { MenuReadPostgresRepository } from './repository/menu.read.pg.repository';
import { MenuWritePostgresRepository } from './repository/menu.write.pg.repository';

const providers = [
  { provide: MenuReadRepoPortToken, useClass: MenuReadPostgresRepository },
  { provide: MenuWriteRepoPortToken, useClass: MenuWritePostgresRepository },
];

@Module({
  imports: [
    MenuModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [MenuModule],
})
export class MenuInfraModule {}
