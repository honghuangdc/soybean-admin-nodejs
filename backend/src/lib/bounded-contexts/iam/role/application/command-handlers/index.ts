import { RoleCreateHandler } from './role-create.command.handler';
import { RoleDeleteHandler } from './role-delete.command.handler';
import { RoleUpdateHandler } from './role-update.command.handler';

export const PubSubCommandHandlers = [
  RoleCreateHandler,
  RoleUpdateHandler,
  RoleDeleteHandler,
];
