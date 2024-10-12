import { IEvent } from '@nestjs/cqrs';

export class DomainDeletedEvent implements IEvent {
  constructor(
    public readonly domainId: string,
    public readonly code: string,
  ) {}
}
