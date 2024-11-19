import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserLoggedInEvent } from '@app/base-system/lib/bounded-contexts/iam/authentication/domain/events/user-logged-in.event';

import { ISecurityConfig, SecurityConfig } from '@lib/config';
import { CacheConstant } from '@lib/constants/cache.constant';
import { RedisUtility } from '@lib/shared/redis/redis.util';

import { RoleReadRepoPortToken } from '../../constants';
import { RoleReadRepoPort } from '../../ports/role.read.repo-port';

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInHandler implements IEventHandler<UserLoggedInEvent> {
  constructor(
    @Inject(RoleReadRepoPortToken)
    private readonly repository: RoleReadRepoPort,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  async handle(event: UserLoggedInEvent) {
    const userId = event.userId;
    const result = await this.repository.findRolesByUserId(userId);
    //TODO means?
    if (result.size > 0) {
      const key = `${CacheConstant.AUTH_TOKEN_PREFIX}${userId}`;
      await RedisUtility.instance.del(key);
      await RedisUtility.instance.sadd(key, ...result);
      await RedisUtility.instance.expire(key, this.securityConfig.jwtExpiresIn);
    }
  }
}
