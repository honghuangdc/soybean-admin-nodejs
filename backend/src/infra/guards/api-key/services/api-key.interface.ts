export interface IApiKeyService {
  loadKeys(): Promise<void>;
  validateKey(apiKey: string): boolean;
  addKey(apiKey: string, secret?: string): Promise<void>;
  removeKey(apiKey: string): Promise<void>;
  updateKey(apiKey: string, newSecret: string): Promise<void>;
}
