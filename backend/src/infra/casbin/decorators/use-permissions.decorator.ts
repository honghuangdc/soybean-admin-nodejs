import { SetMetadata, ExecutionContext } from '@nestjs/common';

import { PERMISSIONS_METADATA } from '@src/infra/casbin/constants/authz.constants';

import { Permission } from '../interfaces/permission.interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultIsOwn = (ctx: ExecutionContext): boolean => false;

/**
 * You can define multiple permissions, but only
 * when all of them satisfied, could you access the route.
 */
export const UsePermissions = (...permissions: Permission[]) => {
  return SetMetadata(PERMISSIONS_METADATA, permissions);
};
