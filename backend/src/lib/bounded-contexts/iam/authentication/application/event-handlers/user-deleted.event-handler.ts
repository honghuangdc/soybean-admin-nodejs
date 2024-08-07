import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserWriteRepoPortToken } from '../../constants';
import { UserDeletedEvent } from '../../domain/events/user-deleted.event';
import { UserWriteRepoPort } from '../../ports/user.write.repo-port';

@EventsHandler(UserDeletedEvent)
export class UserDeletedHandler implements IEventHandler<UserDeletedEvent> {
  constructor() {}
  @Inject(UserWriteRepoPortToken)
  private readonly userWriteRepository: UserWriteRepoPort;

  async handle(event: UserDeletedEvent) {
    await this.userWriteRepository.deleteUserRoleByUserId(event.userId);
  }
}
