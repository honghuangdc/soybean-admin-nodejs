import { Global, Module } from '@nestjs/common';

import { OssConfigService } from './oss.config.service';
import { OssService } from './oss.service';

@Global()
@Module({
  providers: [OssService, OssConfigService],
  exports: [OssService],
})
export class OssModule {}
