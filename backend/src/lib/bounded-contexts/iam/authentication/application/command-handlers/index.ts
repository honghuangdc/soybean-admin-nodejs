import { UserCreateHandler } from './user-create.command-handler';
import { UserUpdateHandler } from './user-update.command-handler';

export const PubSubCommandHandlers = [UserCreateHandler, UserUpdateHandler];
