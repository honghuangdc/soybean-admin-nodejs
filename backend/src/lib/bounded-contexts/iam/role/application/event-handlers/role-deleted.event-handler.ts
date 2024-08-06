import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { RoleWriteRepoPortToken } from '../../constants';
import { RoleDeletedEvent } from '../../domain/events/role-deleted.event';
import { RoleWriteRepoPort } from '../../ports/role.write.repo-port';

@EventsHandler(RoleDeletedEvent)
export class RoleDeletedHandler implements IEventHandler<RoleDeletedEvent> {
  constructor() {}
  @Inject(RoleWriteRepoPortToken)
  private readonly roleWriteRepository: RoleWriteRepoPort;

  async handle(event: RoleDeletedEvent) {
    Logger.log(`Role deleted, event is ${JSON.stringify(event)}`);
  }
}
