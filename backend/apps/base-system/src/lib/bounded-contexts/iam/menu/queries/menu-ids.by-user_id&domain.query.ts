import { IQuery } from '@nestjs/cqrs';

export class MenuIdsByUserIdAndDomainQuery implements IQuery {
  constructor(
    readonly userId: string,
    readonly domain: string,
  ) {}
}
