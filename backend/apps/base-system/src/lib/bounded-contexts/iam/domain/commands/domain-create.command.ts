import { ICommand } from '@nestjs/cqrs';

export class DomainCreateCommand implements ICommand {
  constructor(
    readonly code: string,
    readonly name: string,
    readonly description: string | null,
    readonly uid: string,
  ) {}
}
