import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TokensWriteRepoPortToken } from '../../constants';
import { RefreshTokenUsedEvent } from '../../domain/events/refreshtoken-used.event';
import { TokensWriteRepoPort } from '../../ports/tokens.write.repo-port';

@EventsHandler(RefreshTokenUsedEvent)
export class RefreshTokenUsedEventHandler
  implements IEventHandler<RefreshTokenUsedEvent>
{
  constructor() {}
  @Inject(TokensWriteRepoPortToken)
  private readonly tokensWriteRepository: TokensWriteRepoPort;

  async handle(event: RefreshTokenUsedEvent) {
    await this.tokensWriteRepository.updateTokensStatus(
      event.refreshToken,
      event.status,
    );
  }
}
