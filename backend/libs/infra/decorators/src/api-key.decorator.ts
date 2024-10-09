import { SetMetadata } from '@nestjs/common';

import {
  API_KEY_AUTH_OPTIONS,
  ApiKeyAuthSource,
  ApiKeyAuthStrategy,
} from '@lib/constants/api-key.constant';

export interface ApiKeyAuthOptions {
  strategy: ApiKeyAuthStrategy;
  source?: ApiKeyAuthSource;
  keyName: string;
}

export const ApiKeyAuth = (
  options: ApiKeyAuthOptions = {
    strategy: ApiKeyAuthStrategy.ApiKey,
    keyName: 'api-key',
  },
) => {
  // 默认情况下，如果是 SignedRequest 策略且未指定 source，不设置 source
  if (
    options.strategy === ApiKeyAuthStrategy.SignedRequest &&
    !options.source
  ) {
    delete options.source;
  } else {
    // 如果未明确指定 source，且策略不是 SignedRequest，设置默认 source 为 Header
    options.source = options.source || ApiKeyAuthSource.Header;
  }
  return SetMetadata(API_KEY_AUTH_OPTIONS, options);
};
