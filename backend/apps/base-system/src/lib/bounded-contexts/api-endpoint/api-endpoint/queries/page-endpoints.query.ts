import { IQuery } from '@nestjs/cqrs';

import { PaginationParams } from '@lib/shared/prisma/pagination';

export class PageEndpointsQuery extends PaginationParams implements IQuery {
  readonly path?: string;
  readonly method?: string;
  readonly action?: string;
  readonly resource?: string;
  constructor(options: PageEndpointsQuery) {
    super(options.current, options.size);
    Object.assign(this, options);
  }
}
