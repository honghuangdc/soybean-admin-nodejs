import { PaginationResult } from '@lib/shared/prisma/pagination';

import { RoleProperties } from '../domain/role.read.model';
import { PageRolesQuery } from '../queries/page-roles.query';

export interface RoleReadRepoPort {
  findRolesByUserId(userId: string): Promise<Set<string>>;

  pageRoles(query: PageRolesQuery): Promise<PaginationResult<RoleProperties>>;

  getRoleByCode(code: string): Promise<Readonly<RoleProperties> | null>;

  getRoleById(id: string): Promise<Readonly<RoleProperties> | null>;
}
