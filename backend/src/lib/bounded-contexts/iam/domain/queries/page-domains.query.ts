import { IQuery } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { PaginationParams } from '@app/shared/prisma/pagination';

export class PageDomainsQuery extends PaginationParams implements IQuery {
  readonly name?: string;
  readonly status?: Status;
  constructor(options: PageDomainsQuery) {
    super(options.current, options.size);
    Object.assign(this, options);
  }
}
