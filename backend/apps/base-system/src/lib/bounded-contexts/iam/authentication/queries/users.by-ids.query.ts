import { IQuery } from '@nestjs/cqrs';

export class UsersByIdsQuery implements IQuery {
  constructor(readonly ids: string[]) {}
}
