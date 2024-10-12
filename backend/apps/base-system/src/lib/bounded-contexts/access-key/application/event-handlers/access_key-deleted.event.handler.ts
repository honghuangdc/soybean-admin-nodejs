import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  ComplexApiKeyServiceToken,
  SimpleApiKeyServiceToken,
} from '@lib/infra/guard/api-key/api-key.constants';
import { IApiKeyService } from '@lib/infra/guard/api-key/services/api-key.interface';

import { AccessKeyDeletedEvent } from '../../domain/events/access_key-deleted.event';

@EventsHandler(AccessKeyDeletedEvent)
export class AccessKeyDeletedHandler
  implements IEventHandler<AccessKeyDeletedEvent>
{
  constructor(
    @Inject(SimpleApiKeyServiceToken)
    private readonly simpleApiKeyService: IApiKeyService,
    @Inject(ComplexApiKeyServiceToken)
    private readonly complexApiKeyService: IApiKeyService,
  ) {}

  async handle(event: AccessKeyDeletedEvent) {
    await this.simpleApiKeyService.removeKey(event.AccessKeyID);
    await this.complexApiKeyService.removeKey(event.AccessKeyID);
    Logger.log(
      `AccessKey deleted, AccessKeyDeleted Event is ${JSON.stringify(event)}`,
      '[AccessKey] AccessKeyDeletedHandler',
    );
  }
}
