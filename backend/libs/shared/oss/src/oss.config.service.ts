import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OssConfig } from './oss.config.interface';

@Injectable()
export class OssConfigService {
  constructor(private readonly configService: ConfigService) {}

  getOssConfig(key: string): OssConfig {
    const config = this.configService.get(`oss.${key}`);
    if (!config) {
      throw new Error(`OSS configuration for key '${key}' not found`);
    }
    return config;
  }
}
