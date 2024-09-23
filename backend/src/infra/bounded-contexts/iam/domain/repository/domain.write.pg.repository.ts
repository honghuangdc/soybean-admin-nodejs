import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/shared/prisma/prisma.service';

import { Domain } from '@src/lib/bounded-contexts/iam/domain/domain/domain.model';
import { DomainWriteRepoPort } from '@src/lib/bounded-contexts/iam/domain/ports/domain.write.repo-port';

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
