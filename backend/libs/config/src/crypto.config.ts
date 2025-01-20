import { ConfigType, registerAs } from '@nestjs/config';

import { getEnvString } from '@lib/utils/env';

export const cryptoRegToken = 'crypto';

export const CryptoConfig = registerAs(cryptoRegToken, () => ({
  // AES配置
  aesKey: getEnvString('CRYPTO_AES_KEY', '12345678901234567890123456789012'), // 32字节密钥
  aesIv: getEnvString('CRYPTO_AES_IV', '1234567890123456'), // 16字节IV

  // RSA配置
  rsaPrivateKey: getEnvString(
    'CRYPTO_RSA_PRIVATE_KEY',
    `-----BEGIN PRIVATE KEY-----
    YOUR_DEFAULT_PRIVATE_KEY
    -----END PRIVATE KEY-----`,
  ),
  rsaPublicKey: getEnvString(
    'CRYPTO_RSA_PUBLIC_KEY',
    `-----BEGIN PUBLIC KEY-----
    YOUR_DEFAULT_PUBLIC_KEY
    -----END PUBLIC KEY-----`,
  ),
}));

export type ICryptoConfig = ConfigType<typeof CryptoConfig>;
