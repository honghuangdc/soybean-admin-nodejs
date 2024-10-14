import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationModule } from '@app/base-system/lib/bounded-contexts/iam/authentication/authentication.module';
import {
  UserReadRepoPortToken,
  UserWriteRepoPortToken,
} from '@app/base-system/lib/bounded-contexts/iam/authentication/constants';

import { ConfigKeyPaths, ISecurityConfig, securityRegToken } from '@lib/config';

import { UserReadRepository } from './repository/user.read.pg.repository';
import { UserWriteRepository } from './repository/user.write.pg.repository';

const providers = [
  { provide: UserReadRepoPortToken, useClass: UserReadRepository },
  { provide: UserWriteRepoPortToken, useClass: UserWriteRepository },
];

@Module({
  imports: [
    AuthenticationModule.register({
      inject: [...providers],
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
            const { jwtSecret, jwtExpiresIn } =
              configService.get<ISecurityConfig>(securityRegToken, {
                infer: true,
              });

            return {
              secret: jwtSecret,
              signOptions: {
                expiresIn: `${jwtExpiresIn}s`,
              },
            };
          },
          inject: [ConfigService],
        }),
      ],
    }),
  ],
  exports: [AuthenticationModule],
})
export class IamModule {}
