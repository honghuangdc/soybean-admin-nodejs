import { Module, Global } from '@nestjs/common';

import { ApiDataService } from './index';

@Global()
@Module({
  providers: [ApiDataService],
  exports: [ApiDataService],
})
export class BootstrapModule {}
