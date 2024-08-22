import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';

import { CacheConstant } from '@src/constants/cache.constant';
import { RedisUtility } from '@src/shared/redis/services/redis.util';

import { IApiKeyService } from './api-key.interface';

@Injectable()
export class ComplexApiKeyService implements OnModuleInit, IApiKeyService {
  private apiSecrets: Map<string, string> = new Map();
  private readonly redisService: Redis | Cluster;

  private readonly cacheKey = `${CacheConstant.CACHE_PREFIX}::complex-api-secrets`;

  constructor() {
    this.redisService = RedisUtility.instance;
  }

  async onModuleInit() {
    await this.loadKeys();
  }

  async loadKeys() {
    const secrets = await this.redisService.hgetall(this.cacheKey);
    Object.entries(secrets).forEach(([key, value]) => {
      this.apiSecrets.set(key, value);
    });
  }

  validateKey(apiKey: string): boolean {
    return this.apiSecrets.has(apiKey);
  }

  async addKey(apiKey: string, secret: string): Promise<void> {
    await this.redisService.hset(this.cacheKey, apiKey, secret);
    this.apiSecrets.set(apiKey, secret);
  }

  async removeKey(apiKey: string): Promise<void> {
    await this.redisService.hdel(this.cacheKey, apiKey);
    this.apiSecrets.delete(apiKey);
  }

  async updateKey(apiKey: string, newSecret: string): Promise<void> {
    await this.redisService.hset(this.cacheKey, apiKey, newSecret);
    this.apiSecrets.set(apiKey, newSecret);
  }
}
