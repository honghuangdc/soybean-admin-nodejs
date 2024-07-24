import { IQuery } from '@nestjs/cqrs';

export class MenusByRoleCodeAndDomainQuery implements IQuery {
  constructor(
    readonly roleCode: string[],
    readonly domain: string,
  ) {}
}
