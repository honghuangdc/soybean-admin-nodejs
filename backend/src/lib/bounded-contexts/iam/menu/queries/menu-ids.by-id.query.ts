import { IQuery } from '@nestjs/cqrs';

export class MenuIdsByRoleIdQuery implements IQuery {
  constructor(
    readonly roleId: string,
    readonly domain: string,
  ) {}
}
