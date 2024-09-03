import { ICommand } from '@nestjs/cqrs';

export class AccessKeyCreateCommand implements ICommand {
  constructor(
    readonly domain: string,
    readonly description: string | null,
    readonly uid: string,
  ) {}
}
