import { ICommand } from '@nestjs/cqrs';

export class UserDeleteCommand implements ICommand {
  constructor(readonly id: string) {}
}
