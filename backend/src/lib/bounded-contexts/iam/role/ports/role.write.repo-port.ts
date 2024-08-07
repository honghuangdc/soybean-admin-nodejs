import { Role } from '../domain/role.model';

export interface RoleWriteRepoPort {
  deleteRoleMenuByRoleId(roleId: string): Promise<void>;

  deleteRoleMenuByDomain(domain: string): Promise<void>;

  delete(role: Role): Promise<void>;

  save(role: Role): Promise<void>;

  update(role: Role): Promise<void>;
}
