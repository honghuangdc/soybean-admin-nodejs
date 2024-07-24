import { IQuery } from '@nestjs/cqrs';

export class MenusByIdsQuery implements IQuery {
  constructor(readonly ids: number[]) {}
}
