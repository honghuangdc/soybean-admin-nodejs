import { Injectable } from '@nestjs/common';

import { Domain } from '@app/base-system/lib/bounded-contexts/iam/domain/domain/domain.model';
import { DomainWriteRepoPort } from '@app/base-system/lib/bounded-contexts/iam/domain/ports/domain.write.repo-port';

import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class DomainWriteRepository implements DomainWriteRepoPort {
  constructor(private prisma: PrismaService) {}

  async delete(domain: Domain): Promise<void> {
    await this.prisma.sysDomain.delete({
      where: { id: domain.id },
    });
  }

  async save(domain: Domain): Promise<void> {
    await this.prisma.sysDomain.create({
      data: { ...domain },
    });
  }

  async update(domain: Domain): Promise<void> {
    await this.prisma.sysDomain.update({
      where: { id: domain.id },
      data: { ...domain },
    });
  }
}
