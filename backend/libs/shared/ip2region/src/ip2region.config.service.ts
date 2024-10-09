import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { isDevEnvironment } from '@lib/utils/env';

import { Ip2RegionConfig } from './ip2region.config.interface';

@Injectable()
export class Ip2regionConfigService {
  constructor(private readonly configService: ConfigService) {}

  getIp2RegionConfig(): Ip2RegionConfig {
    const config = this.configService.get(`ip2region`);
    if (!config) {
      Logger.warn(
        'ip2region configuration for key ip2region not found',
        'Ip2regionConfigService',
      );
      // 非必需异常,有些系统不需要ip2region
      // throw new Error(
      //   'ip2region configuration for key ip2region not found',
      // );
    }
    if (!isDevEnvironment) {
      config.xdbPath = `./dist/${config.xdbPath}`;
    }
    return config;
  }
}
