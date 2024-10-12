import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TokensReadRepoPortToken } from '../../constants';
import { TokensReadModel } from '../../domain/tokens.read.model';
import { TokensReadRepoPort } from '../../ports/tokens.read.repo-port';
import { TokensByRefreshTokenQuery } from '../../queries/tokens.by-refresh_token.query';

@QueryHandler(TokensByRefreshTokenQuery)
export class TokensByRefreshTokenQueryHandler
  implements IQueryHandler<TokensByRefreshTokenQuery, TokensReadModel | null>
{
  @Inject(TokensReadRepoPortToken)
  private readonly repository: TokensReadRepoPort;

  async execute(
    query: TokensByRefreshTokenQuery,
  ): Promise<TokensReadModel | null> {
    return this.repository.findTokensByRefreshToken(query.refreshToken);
  }
}
