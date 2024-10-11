import { ConfigType, registerAs } from '@nestjs/config';

import { getEnvNumber, getEnvString, isDevEnvironment } from '@lib/utils/env';

export const securityRegToken = 'security';

export const SecurityConfig = registerAs(securityRegToken, () => ({
  casbinModel: getEnvString(
    'CASBIN_MODEL',
    `${isDevEnvironment ? '' : './dist/'}src/resources/model.conf`,
  ),
  jwtSecret: getEnvString('JWT_SECRET', 'JWT_SECRET-soybean-admin-nest!@#123.'),
  jwtExpiresIn: getEnvNumber('JWT_EXPIRE_IN', 60 * 60 * 2),
  refreshJwtSecret: getEnvString(
    'REFRESH_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET-soybean-admin-nest!@#123.',
  ),
  refreshJwtExpiresIn: getEnvNumber('REFRESH_TOKEN_EXPIRE_IN', 60 * 60 * 12),
  signReqTimestampDisparity: getEnvNumber(
    'SIGN_REQ_TIMESTAMP_DISPARITY',
    5 * 60 * 1000,
  ),
  signReqNonceTTL: getEnvNumber('SIGN_REQ_NONCE_TTL', 300),
}));

export type ISecurityConfig = ConfigType<typeof SecurityConfig>;
