import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Status } from '@prisma/client';

import { UlidGenerator } from '@lib/utils/id.util';

import { DomainCreateCommand } from '../../commands/domain-create.command';
import {
  DomainReadRepoPortToken,
  DomainWriteRepoPortToken,
} from '../../constants';
import { Domain } from '../../domain/domain.model';
import { DomainCreateProperties } from '../../domain/domain.read.model';
import { DomainReadRepoPort } from '../../ports/domain.read.repo-port';
import { DomainWriteRepoPort } from '../../ports/domain.write.repo-port';

@CommandHandler(DomainCreateCommand)
export class DomainCreateHandler
  implements ICommandHandler<DomainCreateCommand, void>
{
  @Inject(DomainWriteRepoPortToken)
  private readonly domainWriteRepository: DomainWriteRepoPort;
  @Inject(DomainReadRepoPortToken)
  private readonly domainReadRepoPort: DomainReadRepoPort;

  async execute(command: DomainCreateCommand) {
    const existingDomain = await this.domainReadRepoPort.getDomainByCode(
      command.code,
    );

    if (existingDomain) {
      throw new BadRequestException(
        `A domain with code ${command.code} already exists.`,
      );
    }

    const domainCreateProperties: DomainCreateProperties = {
      id: UlidGenerator.generate(),
      code: command.code,
      name: command.name,
      status: Status.ENABLED,
      description: command.description,
      createdAt: new Date(),
      createdBy: command.uid,
    };

    const domain = Domain.fromCreate(domainCreateProperties);
    await this.domainWriteRepository.save(domain);
  }
}
