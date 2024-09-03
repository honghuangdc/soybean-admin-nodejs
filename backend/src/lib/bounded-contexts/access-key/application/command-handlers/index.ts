import { AccessKeyCreateHandler } from './access_key-create.command.handler';
import { AccessKeyDeleteHandler } from './access_key-delete.command.handler';

export const PubSubCommandHandlers = [
  AccessKeyCreateHandler,
  AccessKeyDeleteHandler,
];
