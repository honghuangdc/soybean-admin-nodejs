import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { RoleDeleteCommand } from '../../commands/role-delete.command';
import { RoleReadRepoPortToken, RoleWriteRepoPortToken } from '../../constants';
import { Role } from '../../domain/role.model';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { RoleWriteRepoPort } from '../../ports/role.write.repo-port';

@CommandHandler(RoleDeleteCommand)
export class RoleDeleteHandler
  implements ICommandHandler<RoleDeleteCommand, void>
{
  constructor(private readonly publisher: EventPublisher) {}
  @Inject(RoleWriteRepoPortToken)
  private readonly roleWriteRepository: RoleWriteRepoPort;
  @Inject(RoleReadRepoPortToken)
  private readonly roleReadRepoPort: RoleReadRepoPort;

  async execute(command: RoleDeleteCommand) {
    const existingRole = await this.roleReadRepoPort.getRoleById(command.id);

    if (!existingRole) {
      throw new BadRequestException(
        `A role with the specified ID does not exist.`,
      );
    }

    const role = Role.fromProp(existingRole);
    await this.roleWriteRepository.deleteById(role.id);
    await role.deleted();
    this.publisher.mergeObjectContext(role);
    role.commit();
  }
}
