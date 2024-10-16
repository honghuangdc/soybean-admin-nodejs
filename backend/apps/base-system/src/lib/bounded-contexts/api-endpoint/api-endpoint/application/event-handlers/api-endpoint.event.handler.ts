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

  /**
   * 模块初始化时执行的方法
   * 这里我们手动注册事件监听器，以确保能捕获到 API_ENDPOINT 事件
   * 这种方法可以解决 @OnEvent 装饰器在某些情况下不生效的问题
   * 或者另一种方案是在app.module.ts中将BootstrapModule放在最后，这样在模块初始化时，API_ENDPOINT事件已经emit了
   */
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
