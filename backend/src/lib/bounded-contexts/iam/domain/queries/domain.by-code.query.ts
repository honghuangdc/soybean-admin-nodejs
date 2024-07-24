import { IQuery } from '@nestjs/cqrs';

export class FindDomainByCodeQuery implements IQuery {
  constructor(readonly code: string) {}
}
