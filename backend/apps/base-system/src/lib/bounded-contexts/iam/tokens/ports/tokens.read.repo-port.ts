import { TokensReadModel } from '../domain/tokens.read.model';

export interface TokensReadRepoPort {
  findTokensByRefreshToken(
    refreshToken: string,
  ): Promise<TokensReadModel | null>;
}
