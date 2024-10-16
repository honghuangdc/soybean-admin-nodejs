import { Prisma } from '@prisma/client';

import { prisma } from '../helper';

export const initCasbinRule = async () => {
  const data: Prisma.CasbinRuleCreateInput[] = [
    {
      ptype: 'p',
      v0: 'ROLE_SUPER',
      v1: 'authorization',
      v2: 'assign-permission',
      v3: 'built-in',
      v4: null,
      v5: null,
    },
    {
      ptype: 'p',
      v0: 'ROLE_SUPER',
      v1: 'authorization',
      v2: 'assign-routes',
      v3: 'built-in',
      v4: null,
      v5: null,
    },
    {
      ptype: 'p',
      v0: 'ROLE_SUPER',
      v1: 'authorization',
      v2: 'assign-users',
      v3: 'built-in',
      v4: null,
      v5: null,
    },
    {
      ptype: 'p',
      v0: 'ROLE_SUPER',
      v1: 'api-endpoint',
      v2: 'read',
      v3: 'built-in',
      v4: null,
      v5: null,
    },
    {
      ptype: 'p',
      v0: 'ROLE_SUPER',
      v1: 'login-log',
      v2: 'read',
      v3: 'built-in',
      v4: null,
      v5: null,
    },
    {
      ptype: 'p',
      v0: 'ROLE_SUPER',
      v1: 'operation-log',
      v2: 'read',
      v3: 'built-in',
      v4: null,
      v5: null,
    },
    {
      ptype: 'p',
      v0: 'ROLE_ADMIN',
      v1: 'login-log',
      v2: 'read',
      v3: 'built-in',
      v4: null,
      v5: null,
    },
    {
      ptype: 'p',
      v0: 'ROLE_ADMIN',
      v1: 'operation-log',
      v2: 'read',
      v3: 'built-in',
      v4: null,
      v5: null,
    },
  ];

  return prisma.casbinRule.createMany({ data });
};
