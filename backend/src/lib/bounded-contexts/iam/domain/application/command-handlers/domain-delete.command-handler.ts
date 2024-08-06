import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { DomainDeleteCommand } from '../../commands/domain-delete.command';
import {
  DomainReadRepoPortToken,
  DomainWriteRepoPortToken,
} from '../../constants';
import { Domain } from '../../domain/domain.model';
import { DomainReadRepoPort } from '../../ports/domain.read.repo-port';
import { DomainWriteRepoPort } from '../../ports/domain.write.repo-port';

@CommandHandler(DomainDeleteCommand)
export class DomainDeleteHandler
  implements ICommandHandler<DomainDeleteCommand, void>
{
  constructor(private readonly publisher: EventPublisher) {}
  @Inject(DomainWriteRepoPortToken)
  private readonly domainWriteRepository: DomainWriteRepoPort;
  @Inject(DomainReadRepoPortToken)
  private readonly domainReadRepoPort: DomainReadRepoPort;

  async execute(command: DomainDeleteCommand) {
    const existingDomain = await this.domainReadRepoPort.getDomainById(
      command.id,
    );

    if (!existingDomain) {
      throw new BadRequestException(
        `A domain with the specified ID does not exist.`,
      );
    }

    const domain = Domain.fromProp(existingDomain);
    await this.domainWriteRepository.delete(domain);
    await domain.deleted();
    this.publisher.mergeObjectContext(domain);
    domain.commit();
  }
}
