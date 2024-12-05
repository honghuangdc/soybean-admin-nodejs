import { Controller, Get } from '@nestjs/common';

import { BaseDemoService } from './base-demo.service';
import { Public } from '@lib/infra/decorators/public.decorator';

@Controller()
export class BaseDemoController {
  constructor(private readonly baseDemoService: BaseDemoService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.baseDemoService.getHello();
  }
}
