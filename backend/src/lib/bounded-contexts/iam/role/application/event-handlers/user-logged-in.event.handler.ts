import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ISecurityConfig, SecurityConfig } from '@app/config';
import { CacheConstant } from '@app/constants/cache.constant';

import { UserLoggedInEvent } from '@src/lib/bounded-contexts/iam/authentication/domain/events/user-logged-in.event';
import { RedisUtility } from '@src/shared/redis/services/redis.util';

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
    if (result.size > 0) {
      const key = `${CacheConstant.AUTH_TOKEN_PREFIX}${userId}`;
      await RedisUtility.instance.del(key);
      await RedisUtility.instance.sadd(key, ...result);
      await RedisUtility.instance.expire(key, this.securityConfig.jwtExpiresIn);
    }
  }
}
