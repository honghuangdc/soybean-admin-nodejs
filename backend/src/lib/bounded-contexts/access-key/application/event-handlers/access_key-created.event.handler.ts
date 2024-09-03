import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  ComplexApiKeyServiceToken,
  SimpleApiKeyServiceToken,
} from '@src/infra/guards/api-key/api-key.constants';
import { IApiKeyService } from '@src/infra/guards/api-key/services/api-key.interface';

import { AccessKeyCreatedEvent } from '../../domain/events/access_key-created.event';

@EventsHandler(AccessKeyCreatedEvent)
export class AccessKeyCreatedHandler
  implements IEventHandler<AccessKeyCreatedEvent>
{
  constructor(
    @Inject(SimpleApiKeyServiceToken)
    private simpleApiKeyService: IApiKeyService,
    @Inject(ComplexApiKeyServiceToken)
    private complexApiKeyService: IApiKeyService,
  ) {}

  async handle(event: AccessKeyCreatedEvent) {
    await this.simpleApiKeyService.addKey(event.AccessKeyID);
    await this.complexApiKeyService.addKey(
      event.AccessKeyID,
      event.AccessKeySecret,
    );
    Logger.log(
      `AccessKey Created, AccessKeyCreated Event is ${JSON.stringify(event)}`,
      '[AccessKey] AccessKeyCreatedHandler',
    );
  }
}
