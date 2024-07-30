import { MenuIdsByUserIdAndDomainQueryHandler } from './menu-ids.by-user_id&domain.query-handler';
import { MenusByIdsQueryHandler } from './menus.by-ids.query-handler';
import { MenusByRoleCodeAndDomainQueryQueryHandler } from './menus.by-role_code&domain.query-handler';
import { MenusQueryHandler } from './menus.query-handler';

export const QueryHandlers = [
  MenusByRoleCodeAndDomainQueryQueryHandler,
  MenusQueryHandler,
  MenusByIdsQueryHandler,
  MenuIdsByUserIdAndDomainQueryHandler,
];
