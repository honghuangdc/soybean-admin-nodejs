import { ICommand } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

export class RoleCreateCommand implements ICommand {
  constructor(
    readonly code: string,
    readonly name: string,
    readonly pid: string,
    readonly status: Status,
    readonly description: string | null,
    readonly uid: string,
  ) {}
}
