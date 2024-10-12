import { MenuCreateHandler } from './menu-create.command.handler';
import { MenuDeleteHandler } from './menu-delete.command.handler';
import { MenuUpdateHandler } from './menu-update.command.handler';

export const PubSubCommandHandlers = [
  MenuCreateHandler,
  MenuUpdateHandler,
  MenuDeleteHandler,
];
