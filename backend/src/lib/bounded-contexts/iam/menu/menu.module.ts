import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PubSubCommandHandlers } from './application/command-handlers';
import { EventHandlers } from './application/event-handlers';
import { QueryHandlers } from './application/query-handlers';
import { Services } from './application/service';

@Module({})
export class MenuModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: MenuModule,
      imports: [...options.imports],
      providers: [
        ...PubSubCommandHandlers,
        ...EventHandlers,
        ...QueryHandlers,
        ...Services,
        ...options.inject,
      ],
      exports: [...QueryHandlers, ...Services],
    };
  }
}
