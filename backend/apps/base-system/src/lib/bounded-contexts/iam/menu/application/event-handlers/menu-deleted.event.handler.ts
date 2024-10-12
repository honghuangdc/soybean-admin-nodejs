import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { MenuDeletedEvent } from '../../domain/events/menu-deleted.event';

@EventsHandler(MenuDeletedEvent)
export class MenuDeletedHandler implements IEventHandler<MenuDeletedEvent> {
  constructor() {}

  async handle(event: MenuDeletedEvent) {
    Logger.log(
      `Menu Event is ${JSON.stringify(event)}`,
      '[menu] MenuDeletedHandler',
    );
  }
}
