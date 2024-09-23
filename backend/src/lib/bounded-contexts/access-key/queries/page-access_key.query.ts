import { IQuery } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { PaginationParams } from '@app/shared/prisma/pagination';

export class PageAccessKeysQuery extends PaginationParams implements IQuery {
  readonly domain?: string;
  readonly status?: Status;
  constructor(options: PageAccessKeysQuery) {
    super(options.current, options.size);
    Object.assign(this, options);
  }
}
