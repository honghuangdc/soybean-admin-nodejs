import { SignatureAlgorithm } from '../api-key.signature.algorithm';

export interface IApiKeyService {
  loadKeys(): Promise<void>;
  validateKey(apiKey: string, options?: ValidateKeyOptions): Promise<boolean>;
  addKey(apiKey: string, secret?: string): Promise<void>;
  removeKey(apiKey: string): Promise<void>;
  updateKey(apiKey: string, newSecret: string): Promise<void>;
}
export interface ValidateKeyOptions {
  algorithm: SignatureAlgorithm;
  algorithmVersion?: string;
  apiVersion?: string;
  timestamp?: string;
  nonce?: string;
  signature?: string;
  requestParams?: Record<string, any>;
  secret?: string;
}
