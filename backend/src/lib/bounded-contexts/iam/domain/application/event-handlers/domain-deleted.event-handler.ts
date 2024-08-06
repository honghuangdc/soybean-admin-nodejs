import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { DomainWriteRepoPortToken } from '../../constants';
import { DomainDeletedEvent } from '../../domain/events/domain-deleted.event';
import { DomainWriteRepoPort } from '../../ports/domain.write.repo-port';

@EventsHandler(DomainDeletedEvent)
export class DomainDeletedHandler implements IEventHandler<DomainDeletedEvent> {
  constructor() {}
  @Inject(DomainWriteRepoPortToken)
  private readonly domainWriteRepository: DomainWriteRepoPort;

  async handle(event: DomainDeletedEvent) {
    Logger.log(`Domain deleted, event is ${JSON.stringify(event)}`);
  }
}
