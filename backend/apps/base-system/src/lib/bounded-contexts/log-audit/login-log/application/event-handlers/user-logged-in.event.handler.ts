import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserLoggedInEvent } from '@app/base-system/lib/bounded-contexts/iam/authentication/domain/events/user-logged-in.event';

import { LoginLogWriteRepoPortToken } from '../../constants';
import { LoginLogEntity } from '../../domain/login-log.entity';
import { LoginLogWriteRepoPort } from '../../ports/login-log.write.repo-port';

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInHandler implements IEventHandler<UserLoggedInEvent> {
  constructor(
    @Inject(LoginLogWriteRepoPortToken)
    private readonly loginLogWriteRepo: LoginLogWriteRepoPort,
  ) {}

  async handle(event: UserLoggedInEvent) {
    const loginLog = new LoginLogEntity(
      event.userId,
      event.username,
      event.domain,
      event.ip,
      event.address,
      event.userAgent,
      event.requestId,
      event.type,
      event.userId,
      event.port,
    );

    return await this.loginLogWriteRepo.save(loginLog);
  }
}
