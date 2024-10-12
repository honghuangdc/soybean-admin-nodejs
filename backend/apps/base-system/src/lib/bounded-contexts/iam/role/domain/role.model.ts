import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { RoleDeletedEvent } from './events/role-deleted.event';
import {
  RoleCreateProperties,
  RoleProperties,
  RoleUpdateProperties,
} from './role.read.model';

export interface IRole {
  commit(): void;
}

export class Role extends AggregateRoot implements IRole {
  id: string;
  code: string;
  name: string;
  description: string;
  pid: string;
  status: Status;
  createdAt: Date;
  createdBy: string;

  static fromCreate(properties: RoleCreateProperties): Role {
    return Object.assign(new Role(), properties);
  }

  static fromUpdate(properties: RoleUpdateProperties): Role {
    return Object.assign(new Role(), properties);
  }

  static fromProp(properties: RoleProperties): Role {
    return Object.assign(new Role(), properties);
  }

  async deleted() {
    this.apply(new RoleDeletedEvent(this.id, this.code));
  }
}
