import { IQuery } from '@nestjs/cqrs';

export class GetDomainByCodeQuery implements IQuery {
  constructor(readonly code: string) {}
}
