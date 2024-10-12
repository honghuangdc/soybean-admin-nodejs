import { ICommand } from '@nestjs/cqrs';

export class RoleAssignUserCommand implements ICommand {
  constructor(
    readonly roleId: string,
    readonly userIds: string[],
  ) {}
}
