import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PubSubCommandHandlers } from './application/command-handlers';
import { EventHandlers } from './application/event-handlers';
import { QueryHandlers } from './application/query-handlers';

@Module({})
export class RoleModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: RoleModule,
      imports: [...options.imports],
      providers: [
        ...QueryHandlers,
        ...EventHandlers,
        ...PubSubCommandHandlers,
        ...options.inject,
      ],
      exports: [...QueryHandlers],
    };
  }
}
