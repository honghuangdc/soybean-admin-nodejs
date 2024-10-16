import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { API_ENDPOINT } from '@lib/constants/event-emitter-token.constant';

import { ApiEndpointWriteRepoPortToken } from '../../constants';
import { ApiEndpoint } from '../../domain/api-endpoint.model';
import { ApiEndpointWriteRepoPort } from '../../ports/api-endpoint.write.repo-port';

@Injectable()
export class ApiEndpointEventHandler implements OnModuleInit {
  private readonly logger = new Logger(ApiEndpointEventHandler.name);

  constructor(
    @Inject(ApiEndpointWriteRepoPortToken)
    private readonly endpointWriteRepo: ApiEndpointWriteRepoPort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.logger.log('ApiEndpointEventHandler initialized');
    this.eventEmitter.on(API_ENDPOINT, this.handleManually.bind(this));
  }

  private handleManually(payload: ApiEndpoint[]) {
    this.logger.log(`Manually received ${payload.length} API endpoints`);
    this.handle(payload);
  }

  @OnEvent(API_ENDPOINT)
  async handle(payload: ApiEndpoint[]) {
    this.logger.log(`Handling ${payload.length} API endpoints`);
    try {
      await this.endpointWriteRepo.save(payload);
      this.logger.log('API endpoints saved successfully');
    } catch (error) {
      this.logger.error('Failed to save API endpoints', error.stack);
    }
  }
}
