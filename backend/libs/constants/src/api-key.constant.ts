export const API_KEY_AUTH_OPTIONS = Symbol('API_KEY_AUTH_OPTIONS');

export enum ApiKeyAuthStrategy {
  ApiKey = 'api-key',
  SignedRequest = 'signed-request',
}

export enum ApiKeyAuthSource {
  Header = 'header',
  Query = 'query',
}
