import KeyvRedis, { createCluster } from '@keyv/redis';
import { CacheStore } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import Keyv from 'keyv';

import { IRedisConfig } from '@lib/config/redis.config';

@Injectable()
export class KeyvCacheStore implements CacheStore {
  private readonly keyv: Keyv;

  constructor(redisConfig: IRedisConfig) {
    const store =
      redisConfig.mode === 'cluster'
        ? new KeyvRedis(
            createCluster({
              rootNodes: redisConfig.cluster.map((node) => ({
                url: `redis://:${node.password}@${node.host}:${node.port}`,
              })),
            }),
          )
        : new KeyvRedis(
            `redis://:${redisConfig.standalone.password}@${redisConfig.standalone.host}:${redisConfig.standalone.port}/${redisConfig.standalone.db}`,
          );

    this.keyv = new Keyv({ store });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.keyv.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.keyv.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.keyv.delete(key);
  }

  async reset(): Promise<void> {
    await this.keyv.clear();
  }
}
