import { Prisma } from '@prisma/client';

import { prisma } from '../helper';

export const initSysUserRole = async () => {
  const data: Prisma.SysUserRoleCreateInput[] = [
    {
      userId: '1',
      roleId: '1',
    },
    {
      userId: '2',
      roleId: '2',
    },
    {
      userId: '3',
      roleId: '3',
    },
  ];

  return prisma.sysUserRole.createMany({ data });
};
