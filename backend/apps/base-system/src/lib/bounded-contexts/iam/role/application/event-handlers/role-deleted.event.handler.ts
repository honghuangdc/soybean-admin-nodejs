import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AuthZManagementService } from '@lib/infra/casbin';

import { RoleWriteRepoPortToken } from '../../constants';
import { RoleDeletedEvent } from '../../domain/events/role-deleted.event';
import { RoleWriteRepoPort } from '../../ports/role.write.repo-port';

@EventsHandler(RoleDeletedEvent)
export class RoleDeletedHandler implements IEventHandler<RoleDeletedEvent> {
  constructor(
    private readonly authZManagementService: AuthZManagementService,
  ) {}
  @Inject(RoleWriteRepoPortToken)
  private readonly roleWriteRepository: RoleWriteRepoPort;

  async handle(event: RoleDeletedEvent) {
    await this.authZManagementService.removeFilteredPolicy(0, event.code);
    await this.roleWriteRepository.deleteRoleMenuByRoleId(event.roleId);
    Logger.log(
      `Casbin Rule FilteredPolicy with Sub deleted, RoleDeleted Event is ${JSON.stringify(event)}`,
      '[role] RoleDeletedHandler',
    );
  }
}
