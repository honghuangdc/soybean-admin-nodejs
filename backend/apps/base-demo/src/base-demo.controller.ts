import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@lib/infra/decorators/public.decorator';

import { BaseDemoService } from './base-demo.service';

@Controller()
export class BaseDemoController {
  constructor(private readonly baseDemoService: BaseDemoService) {}

  @Get()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Public()
  getHello(): string {
    return this.baseDemoService.getHello();
  }
}
