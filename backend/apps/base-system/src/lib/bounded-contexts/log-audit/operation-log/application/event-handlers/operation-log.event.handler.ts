import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { LOG_OPERATION } from '@lib/constants/event-emitter-token.constant';

import { OperationLogWriteRepoPortToken } from '../../constants';
import { OperationLog } from '../../domain/operation-log.model';
import { OperationLogProperties } from '../../domain/operation-log.read.model';
import { OperationLogWriteRepoPort } from '../../ports/operation-log.write.repo-port';

export class OperationLogEventHandler {
  constructor(
    @Inject(OperationLogWriteRepoPortToken)
    private readonly operationLogWriteRepo: OperationLogWriteRepoPort,
  ) {}

  @OnEvent(LOG_OPERATION)
  async handle(operationLogProperties: OperationLogProperties) {
    const operationLog = new OperationLog(operationLogProperties);
    await this.operationLogWriteRepo.save(operationLog);
  }
}
