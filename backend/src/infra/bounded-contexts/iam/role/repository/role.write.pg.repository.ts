import { Injectable } from '@nestjs/common';

import { Role } from '@src/lib/bounded-contexts/iam/role/domain/role.model';
import { RoleWriteRepoPort } from '@src/lib/bounded-contexts/iam/role/ports/role.write.repo-port';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class RoleWritePostgresRepository implements RoleWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async delete(role: Role): Promise<void> {
    await this.prisma.sysRole.delete({
      where: { id: role.id },
    });
  }

  async save(role: Role): Promise<void> {
    await this.prisma.sysRole.create({
      data: { ...role },
    });
  }

  async update(role: Role): Promise<void> {
    await this.prisma.sysRole.update({
      where: { id: role.id },
      data: { ...role },
    });
  }
}
