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
      data: { ...user, password: user.password.getValue() },
    });
  }
}
