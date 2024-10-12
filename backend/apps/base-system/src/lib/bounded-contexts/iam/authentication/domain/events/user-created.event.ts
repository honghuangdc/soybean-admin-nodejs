import { IEvent } from '@nestjs/cqrs';

export class UserCreatedEvent implements IEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly domain: string,
  ) {}
}
