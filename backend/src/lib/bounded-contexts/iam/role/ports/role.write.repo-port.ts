import { Role } from '../domain/role.model';

export interface RoleWriteRepoPort {
  save(role: Role): Promise<void>;

  update(role: Role): Promise<void>;
}
