import { IQuery } from '@nestjs/cqrs';

export class RoleCodesByUserIdQuery implements IQuery {
  constructor(readonly userId: string) {}
}
