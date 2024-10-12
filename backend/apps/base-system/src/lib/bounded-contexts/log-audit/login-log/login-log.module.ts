import { DynamicModule, Module, Provider } from '@nestjs/common';

import { EventHandlers } from './application/event-handlers';
import { QueryHandlers } from './application/query-handlers';

@Module({})
export class LoginLogModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: LoginLogModule,
      imports: [...options.imports],
      providers: [...EventHandlers, ...QueryHandlers, ...options.inject],
      exports: [...QueryHandlers],
    };
  }
}
