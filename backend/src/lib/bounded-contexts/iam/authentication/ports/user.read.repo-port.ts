import { PaginationResult } from '@src/shared/prisma/pagination';

import { UserProperties } from '../domain/user.read-model';
import { PageUsersQuery } from '../queries/page-users.query';

export interface UserReadRepoPort {
  findUserByIdentifier(identifier: string): Promise<UserProperties | null>;

  pageUsers(query: PageUsersQuery): Promise<PaginationResult<UserProperties>>;

  getUserByUsername(username: string): Promise<Readonly<UserProperties> | null>;
}
