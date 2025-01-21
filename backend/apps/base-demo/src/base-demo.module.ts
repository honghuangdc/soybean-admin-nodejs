import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ExecutionContext, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import * as casbin from 'casbin';
import Redis from 'ioredis';

import { BootstrapModule } from '@lib/bootstrap/bootstrap.module';
import config, {
  ConfigKeyPaths,
  IRedisConfig,
  ISecurityConfig,
  IThrottlerConfig,
  redisRegToken,
  securityRegToken,
  throttlerConfigToken,
} from '@lib/config';
import { SharedModule } from '@lib/global/shared.module';
import { AUTHZ_ENFORCER, AuthZModule, PrismaAdapter } from '@lib/infra/casbin';
import {
  AESMode,
  CryptoMethod,
  CryptoModule,
  PaddingMode,
} from '@lib/infra/crypto';
import { AllExceptionsFilter } from '@lib/infra/filters/all-exceptions.filter';
import { ApiKeyModule } from '@lib/infra/guard/api-key/api-key.module';
import { JwtAuthGuard } from '@lib/infra/guard/jwt.auth.guard';
import { JwtStrategy } from '@lib/infra/strategies/jwt.passport-strategy';
import { IAuthentication } from '@lib/typings/global';
import { getConfigPath } from '@lib/utils/env';

import { BaseDemoController } from './base-demo.controller';
import { BaseDemoService } from './base-demo.service';

const strategies = [JwtStrategy];

// 原nestjs-throttler-storage-redis废弃,迁移至@nest-lab/throttler-storage-redis
// https://github.com/kkoomen/nestjs-throttler-storage-redis
// https://github.com/jmcdo29/nest-lab/tree/main/packages/throttler-storage-redis
class ThrottlerStorageAdapter implements ThrottlerStorage {
  constructor(private readonly storageService: ThrottlerStorageRedisService) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    return this.storageService.increment(
      key,
      ttl,
      limit,
      blockDuration,
      throttlerName,
    );
  }
}

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    AuthZModule.register({
      imports: [ConfigModule],
      enforcerProvider: {
        provide: AUTHZ_ENFORCER,
        useFactory: async (configService: ConfigService) => {
          const adapter = await PrismaAdapter.newAdapter();
          const { casbinModel } = configService.get<ISecurityConfig>(
            securityRegToken,
            {
              infer: true,
            },
          );
          const casbinModelPath = getConfigPath(casbinModel);
          return casbin.newEnforcer(casbinModelPath, adapter);
        },
        inject: [ConfigService],
      },
      userFromContext: (ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: IAuthentication = request.user;
        return user;
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { ttl, limit, errorMessage } =
          configService.get<IThrottlerConfig>(throttlerConfigToken, {
            infer: true,
          });

        const redisOpts = configService.get<IRedisConfig>(redisRegToken, {
          infer: true,
        });

        let throttlerStorageRedisService: ThrottlerStorageRedisService;

        if (redisOpts.mode === 'cluster') {
          throttlerStorageRedisService = new ThrottlerStorageRedisService(
            new Redis.Cluster(redisOpts.cluster),
          );
        } else {
          throttlerStorageRedisService = new ThrottlerStorageRedisService(
            new Redis({
              host: redisOpts.standalone.host,
              port: redisOpts.standalone.port,
              password: redisOpts.standalone.password,
              db: redisOpts.standalone.db,
            }),
          );
        }

        const storageAdapter = new ThrottlerStorageAdapter(
          throttlerStorageRedisService,
        );

        return {
          errorMessage: errorMessage,
          throttlers: [{ ttl, limit }],
          storage: storageAdapter,
        };
      },
    }),

    BootstrapModule,

    SharedModule,

    ApiKeyModule,

    CryptoModule.register({
      isGlobal: true,
      defaultMethod: CryptoMethod.AES,
      aes: {
        mode: AESMode.CBC,
        padding: PaddingMode.PKCS7,
        useRandomIV: false,
      },
    }),
  ],
  controllers: [BaseDemoController],
  providers: [
    BaseDemoService,

    ...strategies,

    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    //TODO 拦截器极度影响性能 有需要自行开启 对性能有要求使用decorator形式 每个接口手动加虽然麻烦点或者app.use指定路由统一使用相对代码量少
    // { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    // { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    // { provide: APP_INTERCEPTOR, useClass: LogInterceptor },

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class BaseDemoModule {}
