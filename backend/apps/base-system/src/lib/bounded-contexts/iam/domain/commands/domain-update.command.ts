import { ICommand } from '@nestjs/cqrs';

import { DomainCreateCommand } from './domain-create.command';

export class DomainUpdateCommand
  extends DomainCreateCommand
  implements ICommand
{
  constructor(
    readonly id: string,
    readonly code: string,
    readonly name: string,
    readonly description: string | null,
    readonly uid: string,
  ) {
    super(code, name, description, uid);
  }
}
