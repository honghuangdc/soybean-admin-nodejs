import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PubSubCommandHandlers } from './application/command-handlers';
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
        ...options.inject,
      ],
      exports: [...QueryHandlers],
    };
  }
}
