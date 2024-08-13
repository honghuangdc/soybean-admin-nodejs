import { ICommand } from '@nestjs/cqrs';

export class MenuDeleteCommand implements ICommand {
  constructor(readonly id: number) {}
}
