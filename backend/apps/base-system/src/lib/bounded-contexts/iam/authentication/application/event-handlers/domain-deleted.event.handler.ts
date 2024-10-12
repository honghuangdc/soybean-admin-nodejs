import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { DomainDeletedEvent } from '../../../domain/domain/events/domain-deleted.event';
import { UserWriteRepoPortToken } from '../../constants';
import { UserWriteRepoPort } from '../../ports/user.write.repo-port';

@EventsHandler(DomainDeletedEvent)
export class DomainDeletedHandler implements IEventHandler<DomainDeletedEvent> {
  constructor() {}
  @Inject(UserWriteRepoPortToken)
  private readonly userWriteRepository: UserWriteRepoPort;

  async handle(event: DomainDeletedEvent) {
    await this.userWriteRepository.deleteUserRoleByDomain(event.code);
    Logger.log(
      `User Role with Domain deleted, Domain Event is ${JSON.stringify(event)}`,
      '[authentication] DomainDeletedHandler',
    );
  }
}
