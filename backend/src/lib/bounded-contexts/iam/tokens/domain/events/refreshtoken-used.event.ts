import { IEvent } from '@nestjs/cqrs';

export class RefreshTokenUsedEvent implements IEvent {
  constructor(
    public readonly refreshToken: string,
    public readonly status: string,
  ) {}
}
