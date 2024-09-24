import { ConfigType, registerAs } from '@nestjs/config';

import {
  getEnvArray,
  getEnvBoolean,
  getEnvNumber,
  getEnvString,
} from '@lib/utils/env';

export const corsRegToken = 'cors';

export const CorsConfig = registerAs(corsRegToken, () => {
  return {
    enabled: getEnvBoolean('CORS_ENABLED', false),
    corsOptions: {
      origin: getEnvArray('CORS_ORIGIN'),
      methods: getEnvString(
        'CORS_METHODS',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      ),
      preflightContinue: getEnvBoolean('CORS_PREFLIGHT_CONTINUE', false),
      optionsSuccessStatus: getEnvNumber('CORS_OPTIONS_SUCCESS_STATUS', 204),
      credentials: getEnvBoolean('CORS_CREDENTIALS', true),
      maxAge: getEnvNumber('CORS_MAX_AGE', 3600),
    },
  };
});

export type ICorsConfig = ConfigType<typeof CorsConfig>;
