import { TokensEntity } from '../domain/tokens.entity';

export interface TokensWriteRepoPort {
  save(tokens: TokensEntity): Promise<void>;

  updateTokensStatus(refreshToken: string, status: string): Promise<void>;
}
