import {ICommand} from '@nestjs/cqrs';

export class RoleCreateCommand implements ICommand {
  constructor(
    readonly code: string,
    readonly name: string,
    readonly pid: string,
    readonly description: string | null,
    readonly uid: string,
  ) {}
}
