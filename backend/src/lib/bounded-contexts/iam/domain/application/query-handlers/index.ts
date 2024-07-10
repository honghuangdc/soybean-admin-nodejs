import { GetDomainByIdQueryHandler } from './domain.by-id.query-handler';
import { PageDomainsQueryHandler } from './page-domains-query.handler';

export const QueryHandlers = [
  PageDomainsQueryHandler,
  GetDomainByIdQueryHandler,
];
