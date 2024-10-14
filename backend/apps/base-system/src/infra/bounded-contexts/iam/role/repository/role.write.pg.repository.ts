import { Injectable } from '@nestjs/common';

import { Role } from '@app/base-system/lib/bounded-contexts/iam/role/domain/role.model';
import { RoleWriteRepoPort } from '@app/base-system/lib/bounded-contexts/iam/role/ports/role.write.repo-port';

import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class RoleWritePostgresRepository implements RoleWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async deleteRoleMenuByRoleId(roleId: string): Promise<void> {
    await this.prisma.sysRoleMenu.deleteMany({
      where: { roleId },
    });
  }

  async deleteRoleMenuByDomain(domain: string): Promise<void> {
    await this.prisma.sysRoleMenu.deleteMany({
      where: { domain },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.sysRole.delete({
      where: { id },
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
