import * as crypto from 'crypto';

import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';

import { ISecurityConfig, SecurityConfig } from '@src/config';
import { CacheConstant } from '@src/constants/cache.constant';
import { RedisUtility } from '@src/shared/redis/services/redis.util';

import { IApiKeyService, ValidateKeyOptions } from './api-key.interface';

@Injectable()
export class ComplexApiKeyService implements OnModuleInit, IApiKeyService {
  private apiSecrets: Map<string, string> = new Map();
  private readonly redisService: Redis | Cluster;

  private readonly cacheKey = `${CacheConstant.CACHE_PREFIX}complex-api-secrets`;

  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {
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

  async validateKey(
    apiKey: string,
    options?: ValidateKeyOptions,
  ): Promise<boolean> {
    if (
      !options ||
      !options.timestamp ||
      !options.nonce ||
      !options.signature
    ) {
      throw new BadRequestException(
        'Missing required fields for signature verification.',
      );
    }

    if (!this.isValidTimestamp(options.timestamp)) {
      throw new BadRequestException('Invalid or expired timestamp.');
    }

    if (!(await this.isValidNonce(options.nonce))) {
      throw new BadRequestException(
        'Nonce has already been used or is too old.',
      );
    }

    const secret = this.apiSecrets.get(apiKey);
    if (!secret) {
      return false;
    }

    const params = options.requestParams ?? {};
    const calculatedSignature = this.calculateSignature(params, secret);
    return calculatedSignature === options.signature;
  }

  private isValidTimestamp(timestamp: string): boolean {
    const requestTime = parseInt(timestamp);
    const currentTime = Date.now();
    return (
      Math.abs(currentTime - requestTime) <
      this.securityConfig.signReqTimestampDisparity
    );
  }

  private async isValidNonce(nonce: string): Promise<boolean> {
    const key = `${CacheConstant.CACHE_PREFIX}sign::nonce:${nonce}`;
    const exists = await this.redisService.get(key);
    if (exists) {
      return false;
    }
    await this.redisService.set(
      key,
      'used',
      'EX',
      this.securityConfig.signReqNonceTTL,
    );
    return true;
  }

  private calculateSignature(
    params: Record<string, any>,
    secret: string,
  ): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { signature, ...paramsToSign } = params;

    const sortedKeys = Object.keys(paramsToSign).sort();
    const signingString = sortedKeys
      .map((key) => {
        const value = encodeURIComponent(paramsToSign[key]);
        return `${key}=${value}`;
      })
      .join('&');

    return crypto
      .createHmac('sha256', secret)
      .update(signingString)
      .digest('hex');
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
