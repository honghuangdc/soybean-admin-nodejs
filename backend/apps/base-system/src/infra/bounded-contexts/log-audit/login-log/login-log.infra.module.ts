import { Module } from '@nestjs/common';

import {
  LoginLogReadRepoPortToken,
  LoginLogWriteRepoPortToken,
} from '@app/base-system/lib/bounded-contexts/log-audit/login-log/constants';
import { LoginLogModule } from '@app/base-system/lib/bounded-contexts/log-audit/login-log/login-log.module';

import { LoginLogReadRepository } from './repository/login-log.read.pg.repository';
import { LoginLogWriteRepository } from './repository/login-log.write.pg.repository';

const providers = [
  {
    provide: LoginLogReadRepoPortToken,
    useClass: LoginLogReadRepository,
  },
  {
    provide: LoginLogWriteRepoPortToken,
    useClass: LoginLogWriteRepository,
  },
];

@Module({
  imports: [
    LoginLogModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [LoginLogModule],
})
export class LoginLogInfraModule {}
