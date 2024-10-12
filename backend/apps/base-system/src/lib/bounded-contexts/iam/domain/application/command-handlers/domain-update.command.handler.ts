import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { DomainUpdateCommand } from '../../commands/domain-update.command';
import {
  DomainReadRepoPortToken,
  DomainWriteRepoPortToken,
} from '../../constants';
import { Domain } from '../../domain/domain.model';
import { DomainUpdateProperties } from '../../domain/domain.read.model';
import { DomainReadRepoPort } from '../../ports/domain.read.repo-port';
import { DomainWriteRepoPort } from '../../ports/domain.write.repo-port';

@CommandHandler(DomainUpdateCommand)
export class DomainUpdateHandler
  implements ICommandHandler<DomainUpdateCommand, void>
{
  @Inject(DomainWriteRepoPortToken)
  private readonly domainWriteRepository: DomainWriteRepoPort;
  @Inject(DomainReadRepoPortToken)
  private readonly domainReadRepoPort: DomainReadRepoPort;

  async execute(command: DomainUpdateCommand) {
    const existingDomain = await this.domainReadRepoPort.getDomainByCode(
      command.code,
    );

    if (existingDomain && existingDomain.id !== command.id) {
      throw new BadRequestException(
        `A domain with code ${command.code} already exists.`,
      );
    }

    const domainUpdateProperties: DomainUpdateProperties = {
      id: command.id,
      code: command.code,
      name: command.name,
      status: Status.ENABLED,
      description: command.description,
      updatedAt: new Date(),
      updatedBy: command.uid,
    };

    const domain = Domain.fromUpdate(domainUpdateProperties);
    await this.domainWriteRepository.update(domain);
  }
}
