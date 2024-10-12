import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { RoleDeletedEvent } from '../../../role/domain/events/role-deleted.event';
import { UserWriteRepoPortToken } from '../../constants';
import { UserWriteRepoPort } from '../../ports/user.write.repo-port';

@EventsHandler(RoleDeletedEvent)
export class RoleDeletedHandler implements IEventHandler<RoleDeletedEvent> {
  constructor() {}
  @Inject(UserWriteRepoPortToken)
  private readonly userWriteRepository: UserWriteRepoPort;

  async handle(event: RoleDeletedEvent) {
    await this.userWriteRepository.deleteUserRoleByRoleId(event.roleId);
    Logger.log(
      `User Role with Role deleted, Role Event is ${JSON.stringify(event)}`,
      '[authentication] RoleDeletedHandler',
    );
  }
}
