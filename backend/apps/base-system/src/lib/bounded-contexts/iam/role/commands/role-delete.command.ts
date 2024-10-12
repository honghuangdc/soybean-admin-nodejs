import { ICommand } from '@nestjs/cqrs';

export class RoleDeleteCommand implements ICommand {
  constructor(readonly id: string) {}
}
