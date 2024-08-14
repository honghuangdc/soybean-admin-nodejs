import { ICommand } from '@nestjs/cqrs';

export class UserUpdateCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly nickName: string,
    readonly avatar: string | null,
    readonly email: string | null,
    readonly phoneNumber: string | null,
    readonly uid: string,
  ) {}
}
