import { Role } from '../domain/role.model';

export interface RoleWriteRepoPort {
  deleteRoleMenuByDomain(domain: string): Promise<void>;

  delete(role: Role): Promise<void>;

  save(role: Role): Promise<void>;

  update(role: Role): Promise<void>;
}
