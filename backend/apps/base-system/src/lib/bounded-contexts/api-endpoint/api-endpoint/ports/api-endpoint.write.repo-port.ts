import { ApiEndpoint } from '../domain/api-endpoint.model';

export interface ApiEndpointWriteRepoPort {
  save(endpoints: ApiEndpoint[]): Promise<void>;
}
