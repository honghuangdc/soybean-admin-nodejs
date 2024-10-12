import { Controller, Get } from '@nestjs/common';

import { BaseSystemService } from './base-system.service';

@Controller()
export class BaseSystemController {
  constructor(private readonly baseSystemService: BaseSystemService) {}

  @Get()
  getHello(): string {
    return this.baseSystemService.getHello();
  }
}
