import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import {
  RoleCreateProperties,
  RoleUpdateProperties,
} from '../domain/role.read-model';

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
}
