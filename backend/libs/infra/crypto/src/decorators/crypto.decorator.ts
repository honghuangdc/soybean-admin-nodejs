import { SetMetadata, applyDecorators } from '@nestjs/common';

import {
  CRYPTO_METHOD_METADATA,
  CRYPTO_OPTIONS_METADATA,
  CRYPTO_DIRECTION_METADATA,
  CryptoMethod,
  CryptoDirection,
  CryptoConfig,
  AESConfig,
  RSAConfig,
} from '../constants/crypto.constant';

/**
 * 加密装饰器
 * @param method 加密方法
 * @param direction 加密方向
 * @param config 加密配置
 * @returns MethodDecorator
 */
export const Crypto = (
  method: CryptoMethod = CryptoMethod.AES,
  direction: CryptoDirection = CryptoDirection.ENCRYPT,
  config?: Partial<AESConfig | RSAConfig>,
) => {
  const options: Partial<CryptoConfig> = {
    method,
    direction,
    ...(method === CryptoMethod.AES
      ? { aes: config as AESConfig }
      : { rsa: config as RSAConfig }),
  };

  return applyDecorators(
    SetMetadata(CRYPTO_METHOD_METADATA, method),
    SetMetadata(CRYPTO_DIRECTION_METADATA, direction),
    SetMetadata(CRYPTO_OPTIONS_METADATA, options),
  );
};

/**
 * AES加密装饰器
 * @param config AES配置
 * @param direction 加密方向
 * @returns MethodDecorator
 */
export const AESCrypto = (
  config: Partial<AESConfig> = {},
  direction: CryptoDirection = CryptoDirection.ENCRYPT,
) => Crypto(CryptoMethod.AES, direction, config);

/**
 * RSA加密装饰器
 * @param config RSA配置
 * @param direction 加密方向
 * @returns MethodDecorator
 */
export const RSACrypto = (
  config: Partial<RSAConfig> = {},
  direction: CryptoDirection = CryptoDirection.ENCRYPT,
) => Crypto(CryptoMethod.RSA, direction, config);

/**
 * 加密配置装饰器
 * @param config 加密配置
 * @returns MethodDecorator
 */
export const WithCryptoConfig = (config: Partial<CryptoConfig>) => {
  if (!config.method) {
    throw new Error('WithCryptoConfig: method is required');
  }
  return SetMetadata(CRYPTO_OPTIONS_METADATA, config);
};
