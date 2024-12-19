import { Controller, Get } from '@nestjs/common';

import { Public } from '@lib/infra/decorators/public.decorator';

import { BaseDemoService } from './base-demo.service';

@Controller()
export class BaseDemoController {
  constructor(private readonly baseDemoService: BaseDemoService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.baseDemoService.getHello();
  }
}
