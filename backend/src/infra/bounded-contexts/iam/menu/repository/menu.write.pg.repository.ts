import { Injectable } from '@nestjs/common';

import { Menu } from '@src/lib/bounded-contexts/iam/menu/domain/menu.model';
import { MenuWriteRepoPort } from '@src/lib/bounded-contexts/iam/menu/ports/menu.write.repo-port';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class MenuWritePostgresRepository implements MenuWriteRepoPort {
  constructor(private prisma: PrismaService) {}

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
