import { Prisma } from '@prisma/client';

import { prisma } from '../helper';

export const initSysRole = async () => {
  const data: Prisma.SysRoleCreateInput[] = [
    {
      id: '1',
      code: 'ROLE_SUPER',
      name: '超级管理员',
      description: '超级管理员',
      pid: '0',
      status: 'ENABLED',
      createdBy: '-1',
      updatedAt: null,
      updatedBy: null,
    },
    {
      id: '2',
      code: 'ROLE_ADMIN',
      name: '管理员',
      description: '管理员',
      pid: '1',
      status: 'ENABLED',
      createdBy: '-1',
      updatedAt: null,
      updatedBy: null,
    },
    {
      id: '3',
      code: 'ROLE_USER',
      name: '用户',
      description: '用户',
      pid: '1',
      status: 'ENABLED',
      createdBy: '-1',
      updatedAt: null,
      updatedBy: null,
    },
  ];

  return prisma.sysRole.createMany({ data });
};
