import { User } from '../domain/user';

export interface UserWriteRepoPort {
  save(role: User): Promise<void>;

  update(role: User): Promise<void>;
}
