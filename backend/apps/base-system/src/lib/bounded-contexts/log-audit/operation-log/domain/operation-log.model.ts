import { AggregateRoot } from '@nestjs/cqrs';

import { OperationLogProperties } from '@app/base-system/lib/bounded-contexts/log-audit/operation-log/domain/operation-log.read.model';

export class OperationLog extends AggregateRoot {
  readonly userId: string;
  readonly username: string;
  readonly domain: string;
  readonly moduleName: string;
  readonly description: string;
  readonly requestId: string;
  readonly method: string;
  readonly url: string;
  readonly ip: string;
  readonly userAgent: string;
  readonly params: any;
  readonly body: any;
  readonly response: any;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly duration: number;

  constructor(properties: OperationLogProperties) {
    super();
    Object.assign(this, properties);
  }
}
