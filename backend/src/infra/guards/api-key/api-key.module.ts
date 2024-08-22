import { Global, Module } from '@nestjs/common';

import { ApiKeyGuard } from './api-key.guard';
import {
  ComplexApiKeyServiceToken,
  SimpleApiKeyServiceToken,
} from './constants';
import { ComplexApiKeyService } from './services/complex-api-key.service';
import { SimpleApiKeyService } from './services/simple-api-key.service';

@Global()
@Module({
  providers: [
    {
      provide: SimpleApiKeyServiceToken,
      useClass: SimpleApiKeyService,
    },
    {
      provide: ComplexApiKeyServiceToken,
      useClass: ComplexApiKeyService,
    },
    ApiKeyGuard,
  ],
  exports: [SimpleApiKeyServiceToken, ComplexApiKeyServiceToken],
})
export class ApiKeyModule {}
