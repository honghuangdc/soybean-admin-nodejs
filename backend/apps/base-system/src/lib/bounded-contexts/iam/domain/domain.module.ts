import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PubSubCommandHandlers } from './application/command-handlers';
import { EventHandlers } from './application/event-handlers';
import { QueryHandlers } from './application/query-handlers';

@Module({})
export class DomainModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: DomainModule,
      imports: [...options.imports],
      providers: [
        ...QueryHandlers,
        ...PubSubCommandHandlers,
        ...EventHandlers,
        ...options.inject,
      ],
      exports: [...QueryHandlers],
    };
  }
}
