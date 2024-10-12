import { IQuery } from '@nestjs/cqrs';

export class FindRoleByIdQuery implements IQuery {
  constructor(readonly id: string) {}
}
