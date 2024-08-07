import { User } from '../domain/user';

export interface UserWriteRepoPort {
  deleteUserRoleByRoleId(roleId: string): Promise<void>;

  deleteUserRoleByDomain(domain: string): Promise<void>;

  deleteUserRoleByUserId(userId: string): Promise<void>;

  delete(user: User): Promise<void>;

  save(role: User): Promise<void>;

  update(role: User): Promise<void>;
}
