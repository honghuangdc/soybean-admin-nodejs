import {
  createCipheriv,
  createDecipheriv,
  privateDecrypt,
  publicEncrypt,
  randomBytes,
  constants,
} from 'crypto';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { CryptoConfig as CryptoConfigType } from '@lib/config/crypto.config';

import {
  AESMode,
  CryptoMethod,
  PaddingMode,
  RSAPaddingMode,
  CryptoConfig,
  AESConfig,
  RSAConfig,
} from '../constants/crypto.constant';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);

  constructor(
    @Inject(CryptoConfigType.KEY)
    private readonly config: ConfigType<typeof CryptoConfigType>,
    @Inject('CRYPTO_MODULE_OPTIONS')
    private readonly moduleOptions: {
      defaultMethod: CryptoMethod;
      aes: AESConfig;
    },
  ) {}

  /**
   * 加密数据
   * @param data 待加密的数据
   * @param config 加密配置
   * @returns 加密后的数据
   */
  encrypt(data: any, config?: Partial<CryptoConfig>): string {
    const method = config?.method || this.moduleOptions.defaultMethod;
    this.logger.debug(`Encrypting data with method: ${method}`);

    // 序列化数据
    const serializedData = this.serializeData(data);
    this.logger.debug(`Serialized data: ${serializedData}`);

    // 加密数据
    const encrypted = this.encryptData(serializedData, method, config);
    this.logger.debug(`Encrypted data: ${encrypted}`);

    return encrypted;
  }

  /**
   * 解密数据
   * @param encryptedData 加密后的数据
   * @param config 解密配置
   * @returns 解密后的数据
   */
  decrypt(encryptedData: string, config?: Partial<CryptoConfig>): any {
    const method = config?.method || this.moduleOptions.defaultMethod;
    this.logger.debug(`Decrypting data with method: ${method}`);

    // 解密数据
    const decrypted = this.decryptData(encryptedData, method, config);
    this.logger.debug(`Decrypted data: ${decrypted}`);

    // 反序列化数据
    const deserialized = this.deserializeData(decrypted);
    this.logger.debug(`Deserialized data: ${JSON.stringify(deserialized)}`);

    return deserialized;
  }

  /**
   * 序列化数据
   */
  private serializeData(data: any): string {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data);
  }

  /**
   * 反序列化数据
   */
  private deserializeData(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  /**
   * 加密数据
   */
  private encryptData(
    data: string,
    method: CryptoMethod,
    config?: Partial<CryptoConfig>,
  ): string {
    switch (method) {
      case CryptoMethod.AES:
        return this.encryptAES(data, config?.aes);
      case CryptoMethod.RSA:
        return this.encryptRSA(data, config?.rsa);
      default:
        throw new Error(`Unsupported encryption method: ${method}`);
    }
  }

  /**
   * 解密数据
   */
  private decryptData(
    data: string,
    method: CryptoMethod,
    config?: Partial<CryptoConfig>,
  ): string {
    switch (method) {
      case CryptoMethod.AES:
        return this.decryptAES(data, config?.aes);
      case CryptoMethod.RSA:
        return this.decryptRSA(data, config?.rsa);
      default:
        throw new Error(`Unsupported decryption method: ${method}`);
    }
  }

  /**
   * AES 加密
   */
  private encryptAES(data: string, config?: Partial<AESConfig>): string {
    const {
      mode = this.moduleOptions.aes.mode,
      padding = this.moduleOptions.aes.padding,
      useRandomIV = this.moduleOptions.aes.useRandomIV,
    } = config || {};

    this.logger.debug(
      `AES encryption config - Mode: ${mode}, Padding: ${padding}, UseRandomIV: ${useRandomIV}`,
    );

    const iv = useRandomIV ? randomBytes(16) : Buffer.from(this.config.aesIv);
    const key = Buffer.from(config?.key || this.config.aesKey);

    this.logger.debug(
      `Using key length: ${key.length}, IV length: ${iv.length}`,
    );

    const cipher = createCipheriv(mode, key, iv);
    cipher.setAutoPadding(padding !== PaddingMode.NoPadding);

    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(data)),
      cipher.final(),
    ]);

    // 如果使用随机IV，将IV和加密数据拼接
    const result = useRandomIV
      ? Buffer.concat([iv, encrypted]).toString('base64')
      : encrypted.toString('base64');

    return result;
  }

  /**
   * AES 解密
   */
  private decryptAES(
    encryptedData: string,
    config?: Partial<AESConfig>,
  ): string {
    const {
      mode = this.moduleOptions.aes.mode,
      padding = this.moduleOptions.aes.padding,
      useRandomIV = this.moduleOptions.aes.useRandomIV,
    } = config || {};

    this.logger.debug(
      `AES decryption config - Mode: ${mode}, Padding: ${padding}, UseRandomIV: ${useRandomIV}`,
    );

    const encryptedBuffer = Buffer.from(encryptedData, 'base64');

    let iv: Buffer;
    let dataToDecrypt: Buffer;

    if (useRandomIV) {
      if (encryptedBuffer.length < 16) {
        throw new Error('Invalid encrypted data: too short for IV');
      }
      iv = encryptedBuffer.subarray(0, 16);
      dataToDecrypt = encryptedBuffer.subarray(16);
    } else {
      iv = Buffer.from(this.config.aesIv);
      dataToDecrypt = encryptedBuffer;
    }

    const key = Buffer.from(config?.key || this.config.aesKey);

    this.logger.debug(
      `Using key length: ${key.length}, IV length: ${iv.length}, Data length: ${dataToDecrypt.length}`,
    );

    const decipher = createDecipheriv(mode, key, iv);
    decipher.setAutoPadding(padding !== PaddingMode.NoPadding);

    const decrypted = Buffer.concat([
      decipher.update(dataToDecrypt),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  /**
   * RSA 加密
   */
  private encryptRSA(data: string, config?: Partial<RSAConfig>): string {
    const publicKey = config?.publicKey || this.config.rsaPublicKey;
    if (!publicKey) {
      throw new Error('RSA public key is required');
    }

    const encrypted = publicEncrypt(
      {
        key: publicKey,
        padding:
          config?.padding === RSAPaddingMode.PKCS1
            ? constants.RSA_PKCS1_PADDING
            : constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(data),
    );

    return encrypted.toString('base64');
  }

  /**
   * RSA 解密
   */
  private decryptRSA(
    encryptedData: string,
    config?: Partial<RSAConfig>,
  ): string {
    const privateKey = config?.privateKey || this.config.rsaPrivateKey;
    if (!privateKey) {
      throw new Error('RSA private key is required');
    }

    const decrypted = privateDecrypt(
      {
        key: privateKey,
        padding:
          config?.padding === RSAPaddingMode.PKCS1
            ? constants.RSA_PKCS1_PADDING
            : constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(encryptedData, 'base64'),
    );

    return decrypted.toString('utf8');
  }
}
