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
  ];

  return prisma.casbinRule.createMany({ data });
};
