import { Module } from '@nestjs/common';

import { ApiEndpointModule } from 'apps/base-system/src/lib/bounded-contexts/api-endpoint/api-endpoint/api-endpoint.module';
import {
  ApiEndpointReadRepoPortToken,
  ApiEndpointWriteRepoPortToken,
} from 'apps/base-system/src/lib/bounded-contexts/api-endpoint/api-endpoint/constants';

import { ApiEndpointReadRepository } from './repository/api-endpoint.read.pg.repository';
import { ApiEndpointWriteRepository } from './repository/api-endpoint.write.pg.repository';

const providers = [
  {
    provide: ApiEndpointReadRepoPortToken,
    useClass: ApiEndpointReadRepository,
  },
  {
    provide: ApiEndpointWriteRepoPortToken,
    useClass: ApiEndpointWriteRepository,
  },
];

@Module({
  imports: [
    ApiEndpointModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [ApiEndpointModule],
})
export class ApiEndpointInfraModule {}
