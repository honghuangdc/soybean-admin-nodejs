import { MenuIdsByRoleIdQueryHandler } from './menu-ids.by-id.query-handler';
import { MenusByIdsQueryHandler } from './menus.by-ids.query-handler';
import { MenusByRoleCodeQueryQueryHandler } from './menus.by-role_code.query-handler';
import { MenusQueryHandler } from './menus.query-handler';

export const QueryHandlers = [
  MenusByRoleCodeQueryQueryHandler,
  MenusQueryHandler,
  MenusByIdsQueryHandler,
  MenuIdsByRoleIdQueryHandler,
];
