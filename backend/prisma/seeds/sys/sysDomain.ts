import { Prisma } from '@prisma/client';

import { prisma } from '../helper';

export const initSysDomain = async () => {
  const data: Prisma.SysDomainCreateInput[] = [
    {
      id: '1',
      code: 'built-in',
      name: 'built-in',
      description: '内置域,请勿进行任何操作',
      status: 'ENABLED',
      createdBy: '-1',
      updatedAt: null,
      updatedBy: null,
    },
  ];

  return prisma.sysDomain.createMany({ data });
};
