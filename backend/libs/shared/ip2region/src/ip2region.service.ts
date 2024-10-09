import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import ip2region, { Searcher } from './ip2region';
import { Ip2RegionConfig, SearchMode } from './ip2region.config.interface';
import { Ip2regionConfigService } from './ip2region.config.service';

@Injectable()
export class Ip2regionService implements OnModuleInit {
  private static searcher: Searcher | null = null;

  constructor(
    private readonly ip2regionConfigService: Ip2regionConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const config: Ip2RegionConfig =
      this.ip2regionConfigService.getIp2RegionConfig();

    if (!config) {
      Logger.warn(
        'The ip2region configuration is missing or incomplete. Please check your configuration files and ensure that all required ip2region settings, including "xdbPath" and "mode", are correctly specified.',
        'Ip2regionService',
      );
      return;
    }

    switch (config.mode) {
      case SearchMode.File:
        Ip2regionService.searcher = ip2region.newWithFileOnly(config.xdbPath);
        Logger.log(
          `Initializing ip2region with File mode using database path: ${config.xdbPath}`,
          'Ip2regionService',
        );
        break;
      case SearchMode.VectorIndex:
        const vectorIndex = ip2region.loadVectorIndexFromFile(config.xdbPath);
        Ip2regionService.searcher = ip2region.newWithVectorIndex(
          config.xdbPath,
          vectorIndex,
        );
        Logger.log(
          `Initializing ip2region with VectorIndex mode using database path: ${config.xdbPath}`,
          'Ip2regionService',
        );
        break;
      case SearchMode.Full:
        const buffer = ip2region.loadContentFromFile(config.xdbPath);
        Ip2regionService.searcher = ip2region.newWithBuffer(buffer);
        Logger.log(
          `Initializing ip2region with Full mode using database path: ${config.xdbPath}`,
          'Ip2regionService',
        );
        break;
      default:
        Logger.warn(
          `Unsupported search mode: ${config.mode}`,
          '',
          'Ip2regionService',
        );
      // 非必需异常,有些系统不需要ip2region
      // throw new Error(`Unsupported search mode: ${config.mode}`);
    }
  }

  public static getSearcher(): Searcher {
    if (!Ip2regionService.searcher) {
      throw new Error('Searcher is not initialized');
    }
    return Ip2regionService.searcher;
  }
}
