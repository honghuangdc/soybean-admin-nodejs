import { AppConfig, IAppConfig, appConfigToken } from './app.config';
import { RedisConfig, IRedisConfig, redisRegToken } from './redis.config';
import {
  SecurityConfig,
  ISecurityConfig,
  securityRegToken,
} from './security.config';
import {
  ThrottlerConfig,
  IThrottlerConfig,
  throttlerConfigToken,
} from './throttler.config';

export * from './app.config';
export * from './redis.config';
export * from './security.config';
export * from './throttler.config';

export interface AllConfigType {
  [appConfigToken]: IAppConfig;
  [redisRegToken]: IRedisConfig;
  [securityRegToken]: ISecurityConfig;
  [throttlerConfigToken]: IThrottlerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  RedisConfig,
  SecurityConfig,
  ThrottlerConfig,
};
