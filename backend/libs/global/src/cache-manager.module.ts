import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ConfigKeyPaths, IRedisConfig, redisRegToken } from '@lib/config';

import { KeyvCacheStore } from './keyv-cache-store';

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

        const keyvCacheStore = new KeyvCacheStore(redisConfig);

        return {
          store: keyvCacheStore,
          isCacheableValue: (value: any) =>
            value !== null && value !== undefined,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CacheManagerModule {}
