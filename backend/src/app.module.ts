import {
  ClassSerializerInterceptor,
  ExecutionContext,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as casbin from 'casbin';
import { Redis } from 'ioredis';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

import { ApiModule } from '@src/api/api.module';
import { BootstrapModule } from '@src/bootstrap/bootstrap.module';
import { GlobalCqrsModule } from '@src/global/module/global.module';
import { AuthZModule, AUTHZ_ENFORCER, PrismaAdapter } from '@src/infra/casbin';
import { AllExceptionsFilter } from '@src/infra/filters/all-exceptions.filter';
import { JwtAuthGuard } from '@src/infra/guards/jwt.auth-guard';
import { LogInterceptor } from '@src/infra/interceptors/log.interceptor';
import { TransformInterceptor } from '@src/infra/interceptors/transform.interceptor';
import { JwtStrategy } from '@src/infra/strategies/jwt.passport-strategy';
import { SharedModule } from '@src/shared/shared.module';

//nest init
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config, {
  ConfigKeyPaths,
  IRedisConfig,
  ISecurityConfig,
  IThrottlerConfig,
  redisRegToken,
  securityRegToken,
  throttlerConfigToken,
} from './config';

const strategies = [JwtStrategy];

@Module({
  imports: [
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
          return casbin.newEnforcer(casbinModel, adapter);
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

        switch (redisOpts.mode) {
          case 'cluster':
            throttlerStorageRedisService = new ThrottlerStorageRedisService(
              new Redis.Cluster(redisOpts.cluster),
            );
            break;
          default:
            throttlerStorageRedisService = new ThrottlerStorageRedisService(
              new Redis({
                host: redisOpts.standalone.host,
                port: redisOpts.standalone.port,
                password: redisOpts.standalone.password,
                db: redisOpts.standalone.db,
              }),
            );
            break;
        }

        return {
          errorMessage: errorMessage,
          throttlers: [
            {
              ttl: ttl,
              limit: limit,
            },
          ],
          storage: throttlerStorageRedisService,
        };
      },
    }),

    BootstrapModule,
    GlobalCqrsModule,

    ApiModule,

    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    ...strategies,

    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LogInterceptor },

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
