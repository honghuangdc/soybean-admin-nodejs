import { PaginationResult } from '@lib/shared/prisma/pagination';

import { UserProperties } from '../domain/user.read.model';
import { PageUsersQuery } from '../queries/page-users.query';

export interface UserReadRepoPort {
  findUserById(id: string): Promise<UserProperties | null>;

  findUserIdsByRoleId(roleId: string): Promise<string[]>;

  findUsersByIds(ids: string[]): Promise<UserProperties[]>;

  findUserByIdentifier(identifier: string): Promise<UserProperties | null>;

  pageUsers(query: PageUsersQuery): Promise<PaginationResult<UserProperties>>;

  getUserByUsername(username: string): Promise<Readonly<UserProperties> | null>;

  findRolesByUserId(userId: string): Promise<Set<string>>;
}
