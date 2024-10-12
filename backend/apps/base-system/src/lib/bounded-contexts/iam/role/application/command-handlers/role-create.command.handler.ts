import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ROOT_PID } from '@lib/shared/prisma/db.constant';
import { UlidGenerator } from '@lib/utils/id.util';

import { RoleCreateCommand } from '../../commands/role-create.command';
import { RoleReadRepoPortToken, RoleWriteRepoPortToken } from '../../constants';
import { Role } from '../../domain/role.model';
import { RoleCreateProperties } from '../../domain/role.read.model';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';
import { RoleWriteRepoPort } from '../../ports/role.write.repo-port';

@CommandHandler(RoleCreateCommand)
export class RoleCreateHandler
  implements ICommandHandler<RoleCreateCommand, void>
{
  @Inject(RoleWriteRepoPortToken)
  private readonly roleWriteRepository: RoleWriteRepoPort;
  @Inject(RoleReadRepoPortToken)
  private readonly roleReadRepoPort: RoleReadRepoPort;

  async execute(command: RoleCreateCommand) {
    const existingRole = await this.roleReadRepoPort.getRoleByCode(
      command.code,
    );

    if (existingRole) {
      throw new BadRequestException(
        `A role with code ${command.code} already exists.`,
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

    const roleCreateProperties: RoleCreateProperties = {
      id: UlidGenerator.generate(),
      code: command.code,
      name: command.name,
      pid: command.pid,
      status: command.status,
      description: command.description,
      createdAt: new Date(),
      createdBy: command.uid,
    };

    const role = Role.fromCreate(roleCreateProperties);
    await this.roleWriteRepository.save(role);
  }
}
