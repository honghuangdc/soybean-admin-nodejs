import { IEvent } from '@nestjs/cqrs';

export class TokenGeneratedEvent implements IEvent {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly userId: string,
    public readonly username: string,
    public readonly domain: string,
    public readonly ip: string,
    public readonly address: string,
    public readonly userAgent: string,
    public readonly requestId: string,
    public readonly type: string,
    public readonly port?: number | null,
  ) {}
}
