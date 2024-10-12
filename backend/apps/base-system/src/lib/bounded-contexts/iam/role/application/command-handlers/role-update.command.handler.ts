import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ROOT_PID } from '@lib/shared/prisma/db.constant';

import { RoleUpdateCommand } from '../../commands/role-update.command';
import { RoleReadRepoPortToken, RoleWriteRepoPortToken } from '../../constants';
import { Role } from '../../domain/role.model';
import { RoleUpdateProperties } from '../../domain/role.read.model';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { RoleWriteRepoPort } from '../../ports/role.write.repo-port';

@CommandHandler(RoleUpdateCommand)
export class RoleUpdateHandler
  implements ICommandHandler<RoleUpdateCommand, void>
{
  @Inject(RoleWriteRepoPortToken)
  private readonly roleWriteRepository: RoleWriteRepoPort;
  @Inject(RoleReadRepoPortToken)
  private readonly roleReadRepoPort: RoleReadRepoPort;

  async execute(command: RoleUpdateCommand) {
    const existingRole = await this.roleReadRepoPort.getRoleByCode(
      command.code,
    );

    if (existingRole && existingRole.id !== command.id) {
      throw new BadRequestException(
        `A role with code ${command.code} already exists.`,
      );
    }

    if (command.pid === command.id) {
      throw new BadRequestException(
        `The parent role identifier '${command.pid}' cannot be the same as its own identifier.`,
      );
    }

    if (command.pid !== ROOT_PID) {
      const parentRole = await this.roleReadRepoPort.getRoleById(command.pid);

      if (!parentRole) {
        throw new BadRequestException(
          `Parent role with code ${command.pid} does not exist.`,
        );
      }
    }

    const roleUpdateProperties: RoleUpdateProperties = {
      id: command.id,
      code: command.code,
      name: command.name,
      pid: command.pid,
      status: command.status,
      description: command.description,
      updatedAt: new Date(),
      updatedBy: command.uid,
    };

    const role = Role.fromUpdate(roleUpdateProperties);
    await this.roleWriteRepository.update(role);
  }
}
