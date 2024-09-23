import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';

import { CacheConstant } from '@app/constants/cache.constant';

import { RedisUtility } from '@src/shared/redis/services/redis.util';

import { IApiKeyService, ValidateKeyOptions } from './api-key.interface';

@Injectable()
export class SimpleApiKeyService implements OnModuleInit, IApiKeyService {
  private apiKeys: Set<string> = new Set();
  private readonly redisService: Redis | Cluster;

  private readonly cacheKey = `${CacheConstant.CACHE_PREFIX}simple-api-keys`;

  constructor() {
    this.redisService = RedisUtility.instance;
  }

  async onModuleInit() {
    await this.loadKeys();
  }

  async loadKeys() {
    const keys = await this.redisService.smembers(this.cacheKey);
    keys.forEach((key) => this.apiKeys.add(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateKey(apiKey: string, _?: ValidateKeyOptions): Promise<boolean> {
    return Promise.resolve(this.apiKeys.has(apiKey));
  }

  async addKey(apiKey: string): Promise<void> {
    await this.redisService.sadd(this.cacheKey, apiKey);
    this.apiKeys.add(apiKey);
  }

  async removeKey(apiKey: string): Promise<void> {
    await this.redisService.srem(this.cacheKey, apiKey);
    this.apiKeys.delete(apiKey);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateKey(_apiKey: string, _newSecret: string): Promise<void> {
    // This method is not applicable for simple API key service.
    throw new Error('Update operation is not supported on simple API keys.');
  }
}
