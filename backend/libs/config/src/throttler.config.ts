import { ConfigType, registerAs } from '@nestjs/config';

import { getEnvNumber } from '@lib/utils/env';

export const throttlerConfigToken = 'throttler';

export const ThrottlerConfig = registerAs(throttlerConfigToken, () => ({
  ttl: getEnvNumber('THROTTLER_TTL', 60000),
  limit: getEnvNumber('THROTTLER_LIMIT', 10),
  errorMessage:
    "Oops! Looks like you've hit our rate limit. Please take a short break and try again shortly",
}));

export type IThrottlerConfig = ConfigType<typeof ThrottlerConfig>;
