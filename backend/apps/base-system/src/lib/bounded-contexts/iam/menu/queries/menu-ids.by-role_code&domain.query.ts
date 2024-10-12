import { IQuery } from '@nestjs/cqrs';

export class MenuIdsByRoleCodeAndDomainQuery implements IQuery {
  constructor(
    readonly roleCode: string,
    readonly domain: string,
  ) {}
}
