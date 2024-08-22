import { Prisma } from '@prisma/client';

import { prisma } from '../helper';

export const initSysRoleMenu = async () => {
  const data: Prisma.SysRoleMenuCreateInput[] = [
    {
      roleId: '1',
      menuId: 5,
      domain: 'built-in',
    },
    {
      roleId: '1',
      menuId: 7,
      domain: 'built-in',
    },
    {
      roleId: '1',
      menuId: 8,
      domain: 'built-in',
    },
    {
      roleId: '1',
      menuId: 9,
      domain: 'built-in',
    },
    {
      roleId: '1',
      menuId: 10,
      domain: 'built-in',
    },
    {
      roleId: '1',
      menuId: 11,
      domain: 'built-in',
    },
    {
      roleId: '2',
      menuId: 5,
      domain: 'built-in',
    },
    {
      roleId: '3',
      menuId: 5,
      domain: 'built-in',
    },
  ];

  return prisma.sysRoleMenu.createMany({ data });
};
