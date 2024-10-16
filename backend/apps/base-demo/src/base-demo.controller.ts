import { Controller, Get } from '@nestjs/common';

import { BaseDemoService } from './base-demo.service';

@Controller()
export class BaseDemoController {
  constructor(private readonly baseDemoService: BaseDemoService) {}

  @Get()
  getHello(): string {
    return this.baseDemoService.getHello();
  }
}
