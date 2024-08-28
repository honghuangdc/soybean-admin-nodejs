import { FindRolesQueryHandler } from './find-roles-query.handler';
import { PageRolesQueryHandler } from './page-roles.query.handler';
import { FindRoleByIdQueryHandler } from './role.by-id.query.handler';

export const QueryHandlers = [
  FindRolesQueryHandler,
  PageRolesQueryHandler,
  FindRoleByIdQueryHandler,
];
