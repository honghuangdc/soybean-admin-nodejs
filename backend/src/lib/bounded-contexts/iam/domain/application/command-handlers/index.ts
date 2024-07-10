import { DomainCreateHandler } from './domain-create.command-handler';
import { DomainUpdateHandler } from './domain-update.command-handler';

export const PubSubCommandHandlers = [DomainCreateHandler, DomainUpdateHandler];
