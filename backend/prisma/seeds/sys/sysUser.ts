import { Prisma } from '@prisma/client';

import { prisma } from '../helper';

export const initSysUser = async () => {
  const data: Prisma.SysUserCreateInput[] = [
    {
      id: '1',
      username: 'Soybean',
      password: '$2a$10$BrNwelZswsGy9FGCTARd5efBtM0Ra4Xz8e8DoT86EOju9Ii0jpBg6',
      domain: 'built-in',
      built_in: true,
      avatar: 'https://minio.bytebytebrew.com/default/Ugly%20Avatar%20Face.png',
      email: '111@gmail.com',
      phoneNumber: '18511111111',
      nickName: 'Soybean',
      status: 'ENABLED',
      createdAt: new Date('2024-05-15T00:00:00.000Z'),
      createdBy: '-1',
      updatedAt: null,
      updatedBy: null,
    },
    {
      id: '2',
      username: 'Administrator',
      password: '$2a$10$BrNwelZswsGy9FGCTARd5efBtM0Ra4Xz8e8DoT86EOju9Ii0jpBg6',
      domain: 'built-in',
      built_in: true,
      avatar: 'https://minio.bytebytebrew.com/default/Ugly%20Avatar%20Face.png',
      email: '222@gmail.com',
      phoneNumber: '18522222222',
      nickName: 'Admin',
      status: 'ENABLED',
      createdBy: '-1',
      updatedAt: null,
      updatedBy: null,
    },
    {
      id: '3',
      username: 'GeneralUser',
      password: '$2a$10$BrNwelZswsGy9FGCTARd5efBtM0Ra4Xz8e8DoT86EOju9Ii0jpBg6',
      domain: 'built-in',
      built_in: true,
      avatar: 'https://minio.bytebytebrew.com/default/Ugly%20Avatar%20Face.png',
      email: '333@gmail.com',
      phoneNumber: '18533333333',
      nickName: 'User',
      status: 'ENABLED',
      createdBy: '-1',
      updatedAt: null,
      updatedBy: null,
    },
  ];

  return prisma.sysUser.createMany({ data });
};
