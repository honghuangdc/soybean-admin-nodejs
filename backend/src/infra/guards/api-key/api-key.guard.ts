import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  API_KEY_AUTH_OPTIONS,
  ApiKeyAuthSource,
  ApiKeyAuthStrategy,
} from '@src/constants/api-key.constant';

import { ApiKeyAuthOptions } from '../../decorators/api-key.decorator';

import {
  ComplexApiKeyServiceToken,
  SimpleApiKeyServiceToken,
} from './api-key.constants';
import {
  IApiKeyService,
  ValidateKeyOptions,
} from './services/api-key.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(SimpleApiKeyServiceToken)
    private simpleApiKeyService: IApiKeyService,
    @Inject(ComplexApiKeyServiceToken)
    private complexApiKeyService: IApiKeyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authOptions = this.reflector.get<ApiKeyAuthOptions>(
      API_KEY_AUTH_OPTIONS,
      context.getHandler(),
    );
    if (!authOptions) return false;

    const request = context.switchToHttp().getRequest();
    const apiKey =
      authOptions.source === ApiKeyAuthSource.Header
        ? request.headers[authOptions.keyName.toLowerCase()]
        : request.query[authOptions.keyName];

    const service =
      authOptions.strategy === ApiKeyAuthStrategy.SignedRequest
        ? this.complexApiKeyService
        : this.simpleApiKeyService;

    const validateOptions: ValidateKeyOptions = {
      timestamp: request.query['timestamp'],
      nonce: request.query['nonce'],
      signature: request.query['signature'],
      requestParams: { ...request.query, ...request.body },
    };

    return service.validateKey(apiKey, validateOptions);
  }
}
