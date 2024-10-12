import { DomainDeletedHandler } from './domain-deleted.event.handler';
import { RoleDeletedHandler } from './role-deleted.event.handler';
import { UserLoggedInHandler } from './user-logged-in.event.handler';

export const EventHandlers = [
  UserLoggedInHandler,
  RoleDeletedHandler,
  DomainDeletedHandler,
];
