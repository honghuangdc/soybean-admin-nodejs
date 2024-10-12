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
  ApiKeyAuthSource,
  ApiKeyAuthStrategy,
} from '@lib/constants/api-key.constant';
import { ApiKeyAuth } from '@lib/infra/decorators/api-key.decorator';
import { BypassTransform } from '@lib/infra/decorators/bypass-transform.decorator';
import { Public } from '@lib/infra/decorators/public.decorator';
import {
  ComplexApiKeyServiceToken,
  SimpleApiKeyServiceToken,
} from '@lib/infra/guard/api-key/api-key.constants';
import { ApiKeyGuard } from '@lib/infra/guard/api-key/api-key.guard';
import { IApiKeyService } from '@lib/infra/guard/api-key/services/api-key.interface';
import { ApiRes } from '@lib/infra/rest/res.response';
import { PrismaService } from '@lib/shared/prisma/prisma.service';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private readonly http: HttpHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly db: PrismaHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    @Inject(SimpleApiKeyServiceToken)
    private readonly simpleApiKeyService: IApiKeyService,
    @Inject(ComplexApiKeyServiceToken)
    private readonly complexApiKeyService: IApiKeyService,
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
