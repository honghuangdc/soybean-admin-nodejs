import { PageUsersQueryHandler } from './page-users.query.handler';
import { UserIdsByRoleIdQueryHandler } from './user-ids.by-role_id.query.handler';
import { UsersByIdsQueryHandler } from './users.by-ids.query.handler';

export const QueryHandlers = [
  PageUsersQueryHandler,
  UsersByIdsQueryHandler,
  UserIdsByRoleIdQueryHandler,
];
