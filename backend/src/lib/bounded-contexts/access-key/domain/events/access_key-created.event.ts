import { IEvent } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

export class AccessKeyCreatedEvent implements IEvent {
  constructor(
    public readonly domain: string,
    public readonly AccessKeyID: string,
    public readonly AccessKeySecret: string,
    public readonly status: Status,
  ) {}
}
