import { IEvent } from '@nestjs/cqrs';

export class RoleDeletedEvent implements IEvent {
  constructor(
    public readonly roleId: string,
    public readonly code: string,
  ) {}
}
