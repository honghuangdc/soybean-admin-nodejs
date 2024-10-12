import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TokenStatus, TokensWriteRepoPortToken } from '../../constants';
import { TokenGeneratedEvent } from '../../domain/events/token-generated.event';
import { TokensEntity } from '../../domain/tokens.entity';
import { TokensProperties } from '../../domain/tokens.read.model';
import { TokensWriteRepoPort } from '../../ports/tokens.write.repo-port';

@EventsHandler(TokenGeneratedEvent)
export class TokenGeneratedEventHandler
  implements IEventHandler<TokenGeneratedEvent>
{
  constructor() {}
  @Inject(TokensWriteRepoPortToken)
  private readonly tokensWriteRepository: TokensWriteRepoPort;

  async handle(event: TokenGeneratedEvent) {
    const tokensProperties: TokensProperties = {
      accessToken: event.accessToken,
      refreshToken: event.refreshToken,
      status: TokenStatus.UNUSED,
      userId: event.userId,
      username: event.username,
      domain: event.domain,
      ip: event.ip,
      port: event.port,
      address: event.address,
      userAgent: event.userAgent,
      requestId: event.requestId,
      type: event.type,
      createdBy: event.userId,
    };
    const tokens = new TokensEntity(tokensProperties);

    await this.tokensWriteRepository.save(tokens);
  }
}
