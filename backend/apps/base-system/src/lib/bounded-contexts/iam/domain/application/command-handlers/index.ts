import { DomainCreateHandler } from './domain-create.command.handler';
import { DomainDeleteHandler } from './domain-delete.command.handler';
import { DomainUpdateHandler } from './domain-update.command.handler';

export const PubSubCommandHandlers = [
  DomainCreateHandler,
  DomainUpdateHandler,
  DomainDeleteHandler,
];
