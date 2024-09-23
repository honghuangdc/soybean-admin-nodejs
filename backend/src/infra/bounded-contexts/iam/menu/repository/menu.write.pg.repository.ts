import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/shared/prisma/prisma.service';

import { Menu } from '@src/lib/bounded-contexts/iam/menu/domain/menu.model';
import { MenuWriteRepoPort } from '@src/lib/bounded-contexts/iam/menu/ports/menu.write.repo-port';

@Injectable()
export class MenuWritePostgresRepository implements MenuWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async deleteById(id: number): Promise<void> {
    await this.prisma.sysMenu.delete({
      where: { id },
    });
  }

  async save(menu: Menu): Promise<void> {
    await this.prisma.sysMenu.create({
      data: { ...menu, id: undefined },
    });
  }

  async update(menu: Menu): Promise<void> {
    await this.prisma.sysMenu.update({
      where: { id: menu.id },
      data: { ...menu },
    });
  }
}
