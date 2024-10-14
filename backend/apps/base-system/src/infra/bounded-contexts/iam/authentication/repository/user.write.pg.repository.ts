import { Injectable } from '@nestjs/common';

import { User } from '@app/base-system/lib/bounded-contexts/iam/authentication/domain/user';
import { UserWriteRepoPort } from '@app/base-system/lib/bounded-contexts/iam/authentication/ports/user.write.repo-port';

import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class UserWriteRepository implements UserWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async deleteUserRoleByRoleId(roleId: string): Promise<void> {
    await this.prisma.sysUserRole.deleteMany({
      where: { roleId },
    });
  }

  async deleteUserRoleByDomain(domain: string): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      const users = await prisma.sysUser.findMany({
        where: { domain },
        select: { id: true },
      });

      const userIds = users.map((user) => user.id);

      if (userIds.length === 0) {
        return;
      }

      await prisma.sysUser.deleteMany({
        where: { id: { in: userIds } },
      });

      await prisma.sysUserRole.deleteMany({
        where: { userId: { in: userIds } },
      });
    });
  }

  async deleteUserRoleByUserId(userId: string): Promise<void> {
    await this.prisma.sysUserRole.deleteMany({
      where: { userId: userId },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.sysUser.delete({
      where: { id },
    });
  }

  async save(user: User): Promise<void> {
    await this.prisma.sysUser.create({
      data: { ...user, password: user.password.getValue() },
    });
  }

  async update(user: User): Promise<void> {
    await this.prisma.sysUser.update({
      where: { id: user.id },
      data: {
        nickName: user.nickName,
        status: user.status,
        avatar: user.avatar,
        email: user.email,
        phoneNumber: user.phoneNumber,
        updatedAt: user.createdAt,
        updatedBy: user.createdBy,
      },
    });
  }
}
