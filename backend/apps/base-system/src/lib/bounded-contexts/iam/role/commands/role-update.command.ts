import { ICommand } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { RoleCreateCommand } from './role-create.command';

export class RoleUpdateCommand extends RoleCreateCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly code: string,
    readonly name: string,
    readonly pid: string,
    readonly status: Status,
    readonly description: string | null,
    readonly uid: string,
  ) {
    super(code, name, pid, status, description, uid);
  }
}
