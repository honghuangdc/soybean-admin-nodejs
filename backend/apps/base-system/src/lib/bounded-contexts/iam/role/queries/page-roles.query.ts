import { IQuery } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { PaginationParams } from '@lib/shared/prisma/pagination';

export class PageRolesQuery extends PaginationParams implements IQuery {
  readonly code?: string;
  readonly name?: string;
  readonly status?: Status;
  constructor(options: PageRolesQuery) {
    super(options.current, options.size);
    Object.assign(this, options);
  }
}
