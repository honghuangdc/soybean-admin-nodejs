import { IQuery } from '@nestjs/cqrs';

import { PaginationParams } from '@app/shared/prisma/pagination';

export class PageLoginLogsQuery extends PaginationParams implements IQuery {
  readonly username?: string;
  readonly domain?: string;
  readonly address?: string;
  readonly type?: string;
  constructor(options: PageLoginLogsQuery) {
    super(options.current, options.size);
    Object.assign(this, options);
  }
}
