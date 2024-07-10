import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import {
  DomainCreateProperties,
  DomainUpdateProperties,
} from './domain-read.model';

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
}
