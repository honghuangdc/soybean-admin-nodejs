import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RoleCodesByUserIdQuery } from '@src/lib/bounded-contexts/iam/role/queries/role_codes_by_user_id_query';
import { PrismaService } from '@src/shared/prisma/prisma.service';

@Injectable()
export class CasbinRuleApiEndpointService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly prisma: PrismaService,
  ) {}

  async authApiEndpoint(userId: string, domain: string) {
    const roleCodes = await this.queryBus.execute<
      RoleCodesByUserIdQuery,
      Set<string>
    >(new RoleCodesByUserIdQuery(userId));

    return this.prisma.casbinRule.findMany({
      where: {
        ptype: 'p',
        v0: { in: Array.from(roleCodes) },
        v3: domain,
      },
    });
  }
}
