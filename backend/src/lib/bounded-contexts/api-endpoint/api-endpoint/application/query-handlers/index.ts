import { FindEndpointsByIdsQueryHandler } from './endpoints.by-ids.query.handler';
import { EndpointsQueryHandler } from './endpoints.query.handler';
import { PageEndpointsQueryHandler } from './page-endpoints.query.handler';

export const QueryHandlers = [
  PageEndpointsQueryHandler,
  FindEndpointsByIdsQueryHandler,
  EndpointsQueryHandler,
];
