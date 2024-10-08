import KeyvRedis from '@keyv/redis';
import { CacheStore } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import Keyv from 'keyv';

import { IRedisConfig } from '@lib/config/redis.config';

@Injectable()
export class KeyvCacheStore implements CacheStore {
  private readonly keyv: Keyv;

  constructor(redisConfig: IRedisConfig) {
    const store =
      redisConfig.mode === 'cluster'
        ? new KeyvRedis(
            new Redis.Cluster(
              redisConfig.cluster.map((node) => ({
                host: node.host,
                port: node.port,
                password: redisConfig.standalone.password,
              })),
            ),
          )
        : new KeyvRedis(
            new Redis({
              host: redisConfig.standalone.host,
              port: redisConfig.standalone.port,
              password: redisConfig.standalone.password,
              db: redisConfig.standalone.db,
            }),
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
}
