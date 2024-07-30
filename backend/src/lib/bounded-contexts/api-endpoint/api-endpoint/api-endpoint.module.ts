import { DynamicModule, Module, Provider } from '@nestjs/common';

import { EventHandlers } from './application/event-handlers';
import { QueryHandlers } from './application/query-handlers';
import { Services } from './application/service';

@Module({})
export class ApiEndpointModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: ApiEndpointModule,
      imports: [...options.imports],
      providers: [
        ...EventHandlers,
        ...QueryHandlers,
        ...Services,
        ...options.inject,
      ],
      exports: [...QueryHandlers, ...Services],
    };
  }
}
