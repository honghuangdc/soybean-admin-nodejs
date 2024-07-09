import { RoleCreateHandler } from './role-create.command-handler';
import { RoleUpdateHandler } from './role-update.command-handler';

export const PubSubCommandHandlers = [RoleCreateHandler, RoleUpdateHandler];
