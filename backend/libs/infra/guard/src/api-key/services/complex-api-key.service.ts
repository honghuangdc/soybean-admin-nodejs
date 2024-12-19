import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import CryptoJS from 'crypto-js';
import Redis, { Cluster } from 'ioredis';

import { ISecurityConfig, SecurityConfig } from '@lib/config';
import { CacheConstant } from '@lib/constants/cache.constant';
import { RedisUtility } from '@lib/shared/redis/redis.util';

import { SignatureAlgorithm } from '../api-key.signature.algorithm';

import { IApiKeyService, ValidateKeyOptions } from './api-key.interface';

@Injectable()
export class ComplexApiKeyService implements OnModuleInit, IApiKeyService {
  private readonly apiSecrets: Map<string, string> = new Map();
  private readonly redisService: Redis | Cluster;

  private readonly cacheKey = `${CacheConstant.CACHE_PREFIX}complex-api-secrets`;

  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
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

  private readonly algorithmHandlers: {
    [key in SignatureAlgorithm]: (data: string, secret: string) => string;
  } = {
    [SignatureAlgorithm.MD5]: (data, secret) =>
      CryptoJS.MD5(data + `&key=${secret}`).toString(),
    [SignatureAlgorithm.SHA1]: (data, secret) =>
      CryptoJS.SHA1(data + `&key=${secret}`).toString(),
    [SignatureAlgorithm.SHA256]: (data, secret) =>
      CryptoJS.SHA256(data + `&key=${secret}`).toString(),
    [SignatureAlgorithm.HMAC_SHA256]: (data, secret) =>
      CryptoJS.HmacSHA256(data, secret).toString(),
  };

  async validateKey(
    apiKey: string,
    options: ValidateKeyOptions,
  ): Promise<boolean> {
    const { timestamp, nonce, signature, algorithm } = options;

    if (!algorithm) {
      throw new BadRequestException(
        'Algorithm is required for signature verification.',
      );
    }

    if (!Object.values(SignatureAlgorithm).includes(algorithm)) {
      throw new BadRequestException(`Unsupported algorithm: ${algorithm}`);
    }

    if (!timestamp || !nonce || !signature) {
      throw new BadRequestException(
        'Missing required fields for signature verification.',
      );
    }

    if (!this.isValidTimestamp(timestamp)) {
      throw new BadRequestException('Invalid or expired timestamp.');
    }

    if (!(await this.isValidNonce(nonce))) {
      throw new BadRequestException(
        'Nonce has already been used or is too old.',
      );
    }

    const secret = this.apiSecrets.get(apiKey);
    if (!secret) {
      return false;
    }

    const params = options.requestParams ?? {};

    // Ensure Algorithm, AlgorithmVersion, ApiVersion are included in params
    params['Algorithm'] = algorithm;
    params['AlgorithmVersion'] = options.algorithmVersion || 'v1';
    params['ApiVersion'] = options.apiVersion || 'v1';

    const calculatedSignature = this.calculateSignature(
      params,
      secret,
      algorithm,
    );

    return calculatedSignature === signature;
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
    algorithm: SignatureAlgorithm,
  ): string {
    // Exclude the 'signature' parameter from the params

    const { signature, ...paramsToSign } = params;

    // Sort the keys
    const sortedKeys = Object.keys(paramsToSign).sort((a, b) =>
      a.localeCompare(b, 'en', { sensitivity: 'base' }),
    );

    // Build the signing string
    const signingString = sortedKeys
      .map((key) => {
        const value = encodeURIComponent(paramsToSign[key]);
        return `${key}=${value}`;
      })
      .join('&');

    const handler = this.algorithmHandlers[algorithm];
    if (!handler) {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    return handler(signingString, secret);
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
