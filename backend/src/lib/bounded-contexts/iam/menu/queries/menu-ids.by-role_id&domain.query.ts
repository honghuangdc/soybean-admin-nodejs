import { IQuery } from '@nestjs/cqrs';

export class MenuIdsByRoleIdAndDomainQuery implements IQuery {
  constructor(
    readonly roleId: string,
    readonly domain: string,
  ) {}
}
