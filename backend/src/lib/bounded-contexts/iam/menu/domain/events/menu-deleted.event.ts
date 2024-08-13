import { IEvent } from '@nestjs/cqrs';

export class MenuDeletedEvent implements IEvent {
  constructor(
    public readonly menuId: number,
    public readonly routeName: string,
  ) {}
}
