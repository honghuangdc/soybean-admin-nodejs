import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserTokenGeneratedEvent } from '../../../authentication/domain/events/user-token-generated.event';
import { TokenStatus, TokensWriteRepoPortToken } from '../../constants';
import { TokensEntity } from '../../domain/tokens.entity';
import { TokensWriteRepoPort } from '../../ports/tokens.write.repo-port';

@EventsHandler(UserTokenGeneratedEvent)
export class UserTokenGeneratedHandler
  implements IEventHandler<UserTokenGeneratedEvent>
{
  constructor() {}
  @Inject(TokensWriteRepoPortToken)
  private readonly tokensWriteRepository: TokensWriteRepoPort;

  async handle(event: UserTokenGeneratedEvent) {
    const tokens = new TokensEntity(
      event.accessToken,
      event.refreshToken,
      TokenStatus.UNUSED,
      event.userId,
      event.username,
      event.domain,
      event.ip,
      event.address,
      event.userAgent,
      event.requestId,
      event.type,
      event.userId,
      event.port,
    );

    await this.tokensWriteRepository.save(tokens);
  }
}
