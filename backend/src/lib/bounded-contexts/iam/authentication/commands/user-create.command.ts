import { ICommand } from '@nestjs/cqrs';

export class UserCreateCommand implements ICommand {
  constructor(
    readonly username: string,
    readonly password: string,
    readonly domain: string,
    readonly nickName: string,
    readonly avatar: string | null,
    readonly email: string | null,
    readonly phoneNumber: string | null,
    readonly uid: string,
  ) {}
}
