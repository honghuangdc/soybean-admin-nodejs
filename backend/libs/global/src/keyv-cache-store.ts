import KeyvRedis, { createClient, createCluster } from '@keyv/redis';
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
            // 集群模式：使用逗号分隔的连接字符串
            redisConfig.cluster
              .map(
                (node) =>
                  `redis://${redisConfig.standalone.password}@${node.host}:${node.port}`,
              )
              .join(','),
          )
        : new KeyvRedis(
            // 单机模式：使用单个连接字符串
            `redis://${redisConfig.standalone.password}@${redisConfig.standalone.host}:${redisConfig.standalone.port}/${redisConfig.standalone.db}`,
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
