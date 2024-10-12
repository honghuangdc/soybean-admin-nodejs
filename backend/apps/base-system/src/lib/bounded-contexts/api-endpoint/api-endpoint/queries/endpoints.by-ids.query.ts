import { IQuery } from '@nestjs/cqrs';

export class FindEndpointsByIdsQuery implements IQuery {
  constructor(readonly ids: string[]) {}
}
