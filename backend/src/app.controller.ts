import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { BypassTransform } from './infra/decorators/bypass-transform.decorator';
import { Public } from './infra/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @BypassTransform()
  getHello(): string {
    return this.appService.getHello();
  }
}
