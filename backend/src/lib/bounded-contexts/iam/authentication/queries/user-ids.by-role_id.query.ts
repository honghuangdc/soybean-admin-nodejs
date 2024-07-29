import { IQuery } from '@nestjs/cqrs';

export class UserIdsByRoleIdQuery implements IQuery {
  constructor(readonly roleId: string) {}
}
