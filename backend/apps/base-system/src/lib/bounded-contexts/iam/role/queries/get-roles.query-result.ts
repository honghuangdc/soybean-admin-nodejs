import { IQueryResult } from '@nestjs/cqrs';

export class GetRolesQueryResult implements IQueryResult {
  constructor(readonly roles: ReadonlyArray<string>) {}
}
