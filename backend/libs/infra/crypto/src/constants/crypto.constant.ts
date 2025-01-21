/**
 * 加密相关的常量定义
 */
export const CRYPTO_HEADER = 'x-crypto';
export const CRYPTO_METHOD_METADATA = 'crypto:method';
export const CRYPTO_OPTIONS_METADATA = 'crypto:options';
export const CRYPTO_DIRECTION_METADATA = 'crypto:direction';

/**
 * 加密方法
 */
export enum CryptoMethod {
  /** AES 加密 */
  AES = 'aes',
  /** RSA 加密 */
  RSA = 'rsa',
}

/**
 * 加密方向
 */
export enum CryptoDirection {
  /** 加密 */
  ENCRYPT = 'encrypt',
  /** 解密 */
  DECRYPT = 'decrypt',
  /** 双向 */
  BOTH = 'both',
}

/**
 * AES 模式
 */
export enum AESMode {
  /** CBC 模式 */
  CBC = 'aes-256-cbc',
  /** ECB 模式 */
  ECB = 'aes-256-ecb',
  /** CTR 模式 */
  CTR = 'aes-256-ctr',
}

/**
 * 填充模式
 */
export enum PaddingMode {
  /** PKCS7 填充 */
  PKCS7 = 'pkcs7',
  /** 不填充 */
  NoPadding = 'nopadding',
}

/**
 * RSA 填充模式
 */
export enum RSAPaddingMode {
  /** PKCS1 填充 */
  PKCS1 = 'pkcs1',
  /** PKCS1_OAEP 填充 */
  PKCS1_OAEP = 'pkcs1_oaep',
}

/**
 * AES 配置
 */
export interface AESConfig {
  /** AES 模式 */
  mode: AESMode;
  /** 填充模式 */
  padding: PaddingMode;
  /** 是否使用随机 IV */
  useRandomIV: boolean;
  /** 密钥 */
  key?: string;
  /** 初始化向量 */
  iv?: string;
}

/**
 * RSA 配置
 */
export interface RSAConfig {
  /** RSA 填充模式 */
  padding: RSAPaddingMode;
  /** 公钥 */
  publicKey?: string;
  /** 私钥 */
  privateKey?: string;
}

/**
 * 加密配置
 */
export interface CryptoConfig {
  /** 加密方法 */
  method: CryptoMethod;
  /** 加密方向 */
  direction?: CryptoDirection;
  /** AES 配置 */
  aes?: AESConfig;
  /** RSA 配置 */
  rsa?: RSAConfig;
}
