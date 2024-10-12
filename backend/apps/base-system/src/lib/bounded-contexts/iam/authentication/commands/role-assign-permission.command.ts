import { ICommand } from '@nestjs/cqrs';

export class RoleAssignPermissionCommand implements ICommand {
  constructor(
    readonly domain: string,
    readonly roleId: string,
    readonly permissions: string[],
  ) {}
}
