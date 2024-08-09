import { Global, Module } from '@nestjs/common';

import { Ip2regionConfigService } from './ip2region.config.service';
import { Ip2regionService } from './ip2region.service';

@Global()
@Module({
  providers: [Ip2regionService, Ip2regionConfigService],
  exports: [Ip2regionService],
})
export class Ip2regionModule {}
