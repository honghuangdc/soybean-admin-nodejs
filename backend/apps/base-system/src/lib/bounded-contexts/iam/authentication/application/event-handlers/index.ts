import { DomainDeletedHandler } from './domain-deleted.event.handler';
import { RoleDeletedHandler } from './role-deleted.event.handler';
import { UserCreatedHandler } from './user-created.event.handler';
import { UserDeletedHandler } from './user-deleted.event.handler';

export const EventHandlers = [
  UserCreatedHandler,
  UserDeletedHandler,
  DomainDeletedHandler,
  RoleDeletedHandler,
];
