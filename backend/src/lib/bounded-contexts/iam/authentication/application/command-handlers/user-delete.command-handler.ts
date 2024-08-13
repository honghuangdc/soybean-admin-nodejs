import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { UserDeleteCommand } from '../../commands/user-delete.command';
import { UserReadRepoPortToken, UserWriteRepoPortToken } from '../../constants';
import { User } from '../../domain/user';
import { UserReadRepoPort } from '../../ports/user.read.repo-port';
import { UserWriteRepoPort } from '../../ports/user.write.repo-port';

@CommandHandler(UserDeleteCommand)
export class UserDeleteHandler
  implements ICommandHandler<UserDeleteCommand, void>
{
  constructor(private readonly publisher: EventPublisher) {}
  @Inject(UserWriteRepoPortToken)
  private readonly userWriteRepository: UserWriteRepoPort;
  @Inject(UserReadRepoPortToken)
  private readonly userReadRepoPort: UserReadRepoPort;

  async execute(command: UserDeleteCommand) {
    const existingUser = await this.userReadRepoPort.findUserById(command.id);

    if (!existingUser) {
      throw new BadRequestException(
        `A user with the specified ID does not exist.`,
      );
    }

    const user = new User(existingUser);
    await this.userWriteRepository.deleteById(user.id);
    await user.deleted();
    this.publisher.mergeObjectContext(user);
    user.commit();
  }
}
