import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { API_ENDPOINT } from '@src/constants/event-emitter-token.constant';

import { ApiEndpointWriteRepoPortToken } from '../../constants';
import { ApiEndpoint } from '../../domain/api-endpoint.model';
import { ApiEndpointWriteRepoPort } from '../../ports/api-endpoint.write.repo-port';

export class ApiEndpointEventHandler {
  constructor(
    @Inject(ApiEndpointWriteRepoPortToken)
    private readonly endpointWriteRepo: ApiEndpointWriteRepoPort,
  ) {}

  @OnEvent(API_ENDPOINT)
  async handle(payload: ApiEndpoint[]) {
    return await this.endpointWriteRepo.save(payload);
  }
}
