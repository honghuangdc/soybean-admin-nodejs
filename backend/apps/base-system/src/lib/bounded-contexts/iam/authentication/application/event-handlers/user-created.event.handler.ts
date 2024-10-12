import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserCreatedEvent } from '../../domain/events/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor() {}

  async handle(event: UserCreatedEvent) {
    Logger.log(
      `User created, event is ${JSON.stringify(event)}`,
      '[authentication] UserCreatedHandler',
    );
  }
}
