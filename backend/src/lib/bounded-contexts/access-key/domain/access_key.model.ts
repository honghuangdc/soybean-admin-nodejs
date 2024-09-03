import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { AccessKeyProperties } from './access_key.read.model';
import { AccessKeyCreatedEvent } from './events/access_key-created.event';
import { AccessKeyDeletedEvent } from './events/access_key-deleted.event';

export interface IAccessKey {
  commit(): void;
}

export class AccessKey extends AggregateRoot implements IAccessKey {
  id: string;
  domain: string;
  AccessKeyID: string;
  AccessKeySecret: string;
  status: Status;
  createdAt: Date;
  createdBy: string;

  static fromProp(properties: AccessKeyProperties): AccessKey {
    return Object.assign(new AccessKey(), properties);
  }

  async created() {
    this.apply(
      new AccessKeyCreatedEvent(
        this.domain,
        this.AccessKeyID,
        this.AccessKeySecret,
        this.status,
      ),
    );
  }

  async deleted() {
    this.apply(
      new AccessKeyDeletedEvent(
        this.domain,
        this.AccessKeyID,
        this.AccessKeySecret,
        this.status,
      ),
    );
  }
}
