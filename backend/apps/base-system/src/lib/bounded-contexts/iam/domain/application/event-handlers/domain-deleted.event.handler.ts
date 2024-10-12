import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AuthZManagementService } from '@lib/infra/casbin';

import { DomainDeletedEvent } from '../../domain/events/domain-deleted.event';

@EventsHandler(DomainDeletedEvent)
export class DomainDeletedHandler implements IEventHandler<DomainDeletedEvent> {
  constructor(
    private readonly authZManagementService: AuthZManagementService,
  ) {}

  async handle(event: DomainDeletedEvent) {
    await this.authZManagementService.removeFilteredPolicy(3, event.code);
    Logger.log(
      `Casbin Rule FilteredPolicy with Domain deleted, Domain Event is ${JSON.stringify(event)}`,
      '[domain] DomainDeletedHandler',
    );
  }
}
