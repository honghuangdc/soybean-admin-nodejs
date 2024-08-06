import { ICommand } from '@nestjs/cqrs';

export class DomainDeleteCommand implements ICommand {
  constructor(readonly id: string) {}
}
