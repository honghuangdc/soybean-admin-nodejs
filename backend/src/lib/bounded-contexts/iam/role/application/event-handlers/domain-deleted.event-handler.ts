import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { DomainDeletedEvent } from '../../../domain/domain/events/domain-deleted.event';
import { RoleWriteRepoPortToken } from '../../constants';
import { RoleWriteRepoPort } from '../../ports/role.write.repo-port';

@EventsHandler(DomainDeletedEvent)
export class DomainDeletedHandler implements IEventHandler<DomainDeletedEvent> {
  constructor() {}
  @Inject(RoleWriteRepoPortToken)
  private readonly roleWriteRepository: RoleWriteRepoPort;

  async handle(event: DomainDeletedEvent) {
    await this.roleWriteRepository.deleteRoleMenuByDomain(event.code);
    Logger.log(
      `Role Menu with Domain deleted, Domain Event is ${JSON.stringify(event)}`,
      '[role] DomainDeletedHandler',
    );
  }
}
