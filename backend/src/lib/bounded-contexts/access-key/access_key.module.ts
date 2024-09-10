import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PubSubCommandHandlers } from './application/command-handlers';
import { EventHandlers } from './application/event-handlers';
import { QueryHandlers } from './application/query-handlers';

@Module({})
export class AccessKeyModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: AccessKeyModule,
      imports: [...options.imports],
      providers: [
        ...PubSubCommandHandlers,
        ...EventHandlers,
        ...QueryHandlers,
        ...options.inject,
      ],
      exports: [...QueryHandlers],
    };
  }
}
