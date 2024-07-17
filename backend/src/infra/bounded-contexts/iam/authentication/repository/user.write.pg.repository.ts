import { Injectable } from '@nestjs/common';

import { User } from '@src/lib/bounded-contexts/iam/authentication/domain/user';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/user.write.repo-port';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class UserWriteRepository implements UserWriteRepoPort {
  constructor(private prisma: PrismaService) {}

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
