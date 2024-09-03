import { ICommand } from '@nestjs/cqrs';

export class AccessKeyDeleteCommand implements ICommand {
  constructor(readonly id: string) {}
}
