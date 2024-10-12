import { ICommand } from '@nestjs/cqrs';

export class RoleAssignRouteCommand implements ICommand {
  constructor(
    readonly domain: string,
    readonly roleId: string,
    readonly menuIds: number[],
  ) {}
}
