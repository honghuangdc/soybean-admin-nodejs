import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import {
  DomainCreateProperties,
  DomainProperties,
  DomainUpdateProperties,
} from './domain.read.model';
import { DomainDeletedEvent } from './events/domain-deleted.event';

export interface IDomain {
  commit(): void;
}

export class Domain extends AggregateRoot implements IDomain {
  id: string;
  code: string;
  name: string;
  description: string;
  status: Status;
  createdAt: Date;
  createdBy: string;

  static fromCreate(properties: DomainCreateProperties): Domain {
    return Object.assign(new Domain(), properties);
  }

  static fromUpdate(properties: DomainUpdateProperties): Domain {
    return Object.assign(new Domain(), properties);
  }

  static fromProp(properties: DomainProperties): Domain {
    return Object.assign(new Domain(), properties);
  }

  async deleted() {
    this.apply(new DomainDeletedEvent(this.id, this.code));
  }
}
