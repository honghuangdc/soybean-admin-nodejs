import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { UserUpdateCommand } from '../../commands/user-update.command';
import { UserReadRepoPortToken, UserWriteRepoPortToken } from '../../constants';
import { User } from '../../domain/user';
import { UserUpdateProperties } from '../../domain/user.read.model';
import { UserReadRepoPort } from '../../ports/user.read.repo-port';
import { UserWriteRepoPort } from '../../ports/user.write.repo-port';

@CommandHandler(UserUpdateCommand)
export class UserUpdateHandler
  implements ICommandHandler<UserUpdateCommand, void>
{
  @Inject(UserWriteRepoPortToken)
  private readonly userWriteRepository: UserWriteRepoPort;
  @Inject(UserReadRepoPortToken)
  private readonly userReadRepoPort: UserReadRepoPort;

  async execute(command: UserUpdateCommand) {
    const existingUser = await this.userReadRepoPort.getUserByUsername(
      command.username,
    );

    if (existingUser && existingUser.id !== command.id) {
      throw new BadRequestException(
        `A user with account ${command.username} already exists.`,
      );
    }

    const userUpdateProperties: UserUpdateProperties = {
      id: command.id,
      nickName: command.nickName,
      status: Status.ENABLED,
      avatar: command.avatar,
      email: command.email,
      phoneNumber: command.phoneNumber,
      createdAt: new Date(),
      createdBy: command.uid,
    };

    const user = new User(userUpdateProperties);
    await this.userWriteRepository.update(user);
  }
}
