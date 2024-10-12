import { IQuery } from '@nestjs/cqrs';

import { PaginationParams } from '@lib/shared/prisma/pagination';

export class PageOperationLogsQuery extends PaginationParams implements IQuery {
  readonly username?: string;
  readonly domain?: string;
  readonly moduleName?: string;
  readonly method?: string;
  constructor(options: PageOperationLogsQuery) {
    super(options.current, options.size);
    Object.assign(this, options);
  }
}
