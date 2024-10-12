import { IQuery } from '@nestjs/cqrs';

export class MenusTreeQuery implements IQuery {
  constructor(readonly constant: boolean = false) {}
}
