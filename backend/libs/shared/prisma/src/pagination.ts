import { IQueryResult } from '@nestjs/cqrs';

export class PaginationParams {
  constructor(
    public readonly current: number,
    public readonly size: number,
  ) {}
}

export class PaginationResult<T> implements IQueryResult {
  constructor(
    public readonly current: number,
    public readonly size: number,
    public readonly total: number,
    public readonly records: T[],
  ) {}
}
