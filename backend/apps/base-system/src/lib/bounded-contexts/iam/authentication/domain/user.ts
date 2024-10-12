import { AggregateRoot } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { UserCreatedEvent } from './events/user-created.event';
import { UserDeletedEvent } from './events/user-deleted.event';
import { Password } from './password.value-object';
import {
  UserCreateProperties,
  UserProperties,
  UserUpdateProperties,
} from './user.read.model';

export interface IUser {
  verifyPassword(password: string): Promise<boolean>;
  canLogin(): Promise<boolean>;
  loginUser(password: string): Promise<{ success: boolean; message: string }>;
  commit(): void;
}

export class User extends AggregateRoot implements IUser {
  readonly id: string;
  readonly username: string;
  readonly nickName: string;
  readonly password: Password;
  readonly status: Status;
  readonly domain: string;
  readonly avatar: string | null;
  readonly email: string | null;
  readonly phoneNumber: string | null;
  createdAt: Date;
  createdBy: string;

  constructor(
    properties: UserProperties | UserCreateProperties | UserUpdateProperties,
  ) {
    super();
    Object.assign(this, properties);
    if ('password' in properties && properties.password) {
      this.password = Password.fromHashed(properties.password);
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    return this.password.compare(password);
  }

  async canLogin(): Promise<boolean> {
    return this.status === Status.ENABLED;
  }

  async loginUser(
    password: string,
  ): Promise<{ success: boolean; message: string }> {
    if (this.status !== Status.ENABLED) {
      return {
        success: false,
        message: `User is ${this.status.toLowerCase()}.`,
      };
    }

    const isPasswordValid = await this.verifyPassword(password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid credentials.' };
    }

    return { success: true, message: 'Login successful' };
  }

  async created() {
    this.apply(new UserCreatedEvent(this.id, this.username, this.domain));
  }

  async deleted() {
    this.apply(new UserDeletedEvent(this.id, this.username, this.domain));
  }
}
