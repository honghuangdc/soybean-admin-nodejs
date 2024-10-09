import { Injectable, OnModuleDestroy } from '@nestjs/common';
import OSS from 'ali-oss';

import { OssConfigService } from './oss.config.service';

@Injectable()
export class OssService implements OnModuleDestroy {
  private readonly ossClients: Map<string, OSS> = new Map();

  constructor(private readonly ossConfigService: OssConfigService) {}

  private async getClient(key: string): Promise<OSS> {
    if (!this.ossClients.has(key)) {
      const config = this.ossConfigService.getOssConfig(key);
      const client = new OSS(config);
      this.ossClients.set(key, client);
      return client;
    }
    const client = this.ossClients.get(key);
    if (!client) {
      throw new Error(`No OSS client found for key: ${key}`);
    }
    return client;
  }

  async uploadFile(
    key: string,
    file: Buffer,
    name: string,
  ): Promise<OSS.PutObjectResult> {
    const client = await this.getClient(key);
    return client.put(name, file);
  }

  async getFileUrl(key: string, name: string): Promise<string> {
    const client = await this.getClient(key);
    return client.generateObjectUrl(name);
  }

  onModuleDestroy() {
    this.ossClients.clear();
  }
}
