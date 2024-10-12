import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { AccessKeyDeleteCommand } from '../../commands/access_key-delete.command';
import {
  AccessKeyReadRepoPortToken,
  AccessKeyWriteRepoPortToken,
} from '../../constants';
import { AccessKey } from '../../domain/access_key.model';
import { AccessKeyReadRepoPort } from '../../ports/access_key.read.repo-port';
import { AccessKeyWriteRepoPort } from '../../ports/access_key.write.repo-port';

@CommandHandler(AccessKeyDeleteCommand)
export class AccessKeyDeleteHandler
  implements ICommandHandler<AccessKeyDeleteCommand, void>
{
  constructor(private readonly publisher: EventPublisher) {}
  @Inject(AccessKeyWriteRepoPortToken)
  private readonly accessKeyWriteRepository: AccessKeyWriteRepoPort;
  @Inject(AccessKeyReadRepoPortToken)
  private readonly accessKeyReadRepoPort: AccessKeyReadRepoPort;

  async execute(command: AccessKeyDeleteCommand) {
    const existingAccessKey = await this.accessKeyReadRepoPort.getAccessKeyById(
      command.id,
    );

    if (!existingAccessKey) {
      throw new BadRequestException(
        `A accessKey with the specified ID does not exist.`,
      );
    }

    const accessKey = AccessKey.fromProp(existingAccessKey);
    await this.accessKeyWriteRepository.deleteById(accessKey.id);
    await accessKey.deleted();
    this.publisher.mergeObjectContext(accessKey);
    accessKey.commit();
  }
}
