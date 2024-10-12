import { Injectable } from '@nestjs/common';

import { PrismaService } from '@lib/shared/prisma/prisma.service';

@Injectable()
export class CasbinRuleApiEndpointService {
  constructor(private readonly prisma: PrismaService) {}

  async authApiEndpoint(roleCode: string, domain: string) {
    return this.prisma.casbinRule.findMany({
      where: {
        ptype: 'p',
        v0: roleCode,
        v3: domain,
      },
    });
  }
}
