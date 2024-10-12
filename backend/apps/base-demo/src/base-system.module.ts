import { Module } from '@nestjs/common';

import { BaseSystemController } from './base-system.controller';
import { BaseSystemService } from './base-system.service';

@Module({
  imports: [],
  controllers: [BaseSystemController],
  providers: [BaseSystemService],
})
export class BaseSystemModule {}
