import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisOptions } from 'ioredis';

import { ConfigKeyPaths, IRedisConfig, redisRegToken } from '@app/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<ConfigKeyPaths>) => {
        const redisConfig: IRedisConfig = configService.get<IRedisConfig>(
          redisRegToken,
          { infer: true },
        );

        let storeOptions;
        if (redisConfig.mode === 'cluster') {
          storeOptions = {
            clusterConfig: {
              nodes: redisConfig.cluster,
              options: {},
            },
          };
        } else {
          storeOptions = {
            host: redisConfig.standalone.host,
            port: redisConfig.standalone.port,
            password: redisConfig.standalone.password,
            db: redisConfig.standalone.db,
          } as RedisOptions;
        }

        const store = await redisStore(storeOptions);

        return {
          store: store,
          isCacheableValue: (value: any) =>
            value !== null && value !== undefined,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CacheManagerModule {}
