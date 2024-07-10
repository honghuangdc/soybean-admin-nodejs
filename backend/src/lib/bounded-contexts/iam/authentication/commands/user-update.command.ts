import { ICommand } from '@nestjs/cqrs';

import { UserCreateCommand } from './user-create.command';

export class UserUpdateCommand extends UserCreateCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly password: string,
    readonly domain: string,
    readonly nickName: string,
    readonly avatar: string | null,
    readonly email: string | null,
    readonly phoneNumber: string | null,
    readonly uid: string,
  ) {
    super(
      username,
      password,
      domain,
      nickName,
      avatar,
      email,
      phoneNumber,
      uid,
    );
  }
}
