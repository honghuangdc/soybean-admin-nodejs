import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as casbin from 'casbin';

import { CacheConstant } from '@lib/constants/cache.constant';
import { RedisUtility } from '@lib/shared/redis/redis.util';

import {
  AUTHZ_ENFORCER,
  AUTHZ_MODULE_OPTIONS,
  PERMISSIONS_METADATA,
} from '../constants/authz.constants';
import { AuthZModuleOptions, Permission } from '../interfaces';

@Injectable()
export class AuthZGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTHZ_ENFORCER) private readonly enforcer: casbin.Enforcer,
    @Inject(AUTHZ_MODULE_OPTIONS) private readonly options: AuthZModuleOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const permissions: Permission[] = this.reflector.get<Permission[]>(
        PERMISSIONS_METADATA,
        context.getHandler(),
      );

      if (!permissions) {
        return true;
      }

      const user = this.options.userFromContext(context);

      if (!user) {
        throw new UnauthorizedException();
      }

      const userRoles = await RedisUtility.instance.smembers(
        `${CacheConstant.AUTH_TOKEN_PREFIX}${user.uid}`,
      );

      if (userRoles && userRoles.length <= 0) {
        return false;
      }

      return await AuthZGuard.asyncEvery<Permission>(
        permissions,
        async (permission) =>
          this.hasPermission(
            new Set(userRoles),
            user.domain,
            permission,
            context,
            this.enforcer,
          ),
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async hasPermission(
    roles: Set<string>,
    domain: string,
    permission: Permission,
    context: ExecutionContext,
    enforcer: casbin.Enforcer,
  ): Promise<boolean> {
    const { resource, action } = permission;

    return AuthZGuard.asyncSome<string>(Array.from(roles), async (role) => {
      return enforcer.enforce(role, resource, action, domain);
    });
  }

  static async asyncSome<T>(
    array: T[],
    callback: (value: T, index: number, a: T[]) => Promise<boolean>,
  ): Promise<boolean> {
    for (let i = 0; i < array.length; i++) {
      const result = await callback(array[i], i, array);
      if (result) {
        return result;
      }
    }

    return false;
  }

  static async asyncEvery<T>(
    array: T[],
    callback: (value: T, index: number, a: T[]) => Promise<boolean>,
  ): Promise<boolean> {
    for (let i = 0; i < array.length; i++) {
      const result = await callback(array[i], i, array);
      if (!result) {
        return result;
      }
    }

    return true;
  }
}
