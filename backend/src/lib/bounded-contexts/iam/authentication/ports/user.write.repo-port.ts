import { User } from '../domain/user';

export interface UserWriteRepoPort {
  deleteUserRoleByDomain(domain: string): Promise<void>;

  deleteUserRole(userId: string): Promise<void>;

  delete(user: User): Promise<void>;

  save(role: User): Promise<void>;

  update(role: User): Promise<void>;
}
