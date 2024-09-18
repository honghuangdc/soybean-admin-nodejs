import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

import {
  ComplexApiKeyServiceToken,
  SimpleApiKeyServiceToken,
} from '@src/infra/guards/api-key/api-key.constants';
import { IApiKeyService } from '@src/infra/guards/api-key/services/api-key.interface';

import { AppService } from './app.service';
import {
  ApiKeyAuthSource,
  ApiKeyAuthStrategy,
} from './constants/api-key.constant';
import { ApiKeyAuth } from './infra/decorators/api-key.decorator';
import { BypassTransform } from './infra/decorators/bypass-transform.decorator';
import { Public } from './infra/decorators/public.decorator';
import { ApiKeyGuard } from './infra/guards/api-key/api-key.guard';
import { ApiRes } from './infra/rest/res.response';
import { PrismaService } from './shared/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private http: HttpHealthIndicator,
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    @Inject(SimpleApiKeyServiceToken)
    private simpleApiKeyService: IApiKeyService,
    @Inject(ComplexApiKeyServiceToken)
    private complexApiKeyService: IApiKeyService,
  ) {}

  @Get()
  @Public()
  @BypassTransform()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/healthy')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database', this.prisma, { timeout: 1000 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  @Get('/system-info')
  async getSystemInfo() {
    const result = await this.appService.getSystemInfo();
    return ApiRes.success(result);
  }

  @Get('/redis-info')
  async getRedisInfo() {
    const result = await this.appService.getRedisInfo();
    return ApiRes.success(result);
  }

  @Get('apikey-protected-set')
  @Public()
  async apiKeySet() {
    await this.simpleApiKeyService.addKey('soybean-api-key');
  }

  @Get('apikey-protected')
  @Public()
  @ApiKeyAuth({
    strategy: ApiKeyAuthStrategy.ApiKey,
    keyName: 'api-key',
    source: ApiKeyAuthSource.Header,
  })
  @UseGuards(ApiKeyGuard)
  async apiKey() {
    return this.appService.getHello();
  }

  @Get('sign-protected-set')
  @Public()
  async signProtectedSet() {
    await this.complexApiKeyService.addKey(
      'soybean-api-key',
      'soybean-api-secret',
    );
  }

  @Get('sign-protected')
  @Public()
  @ApiKeyAuth({
    strategy: ApiKeyAuthStrategy.SignedRequest,
    keyName: 'AccessKeyId',
  })
  @UseGuards(ApiKeyGuard)
  async apiKeyAndSecret() {
    return this.appService.getHello();
  }
}
