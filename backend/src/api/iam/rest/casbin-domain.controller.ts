import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PageCasbinDomainsQueryDto } from '@src/api/iam/dto/page-casbin-domains.query-dto';
import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import {
  CasbinDomainProperties,
  CasbinDomainReadModel,
} from '@src/lib/bounded-contexts/iam/casbin-domain/domain/casbin-domain.read-model';
import { PageCasbinDomainsQuery } from '@src/lib/bounded-contexts/iam/casbin-domain/queries/page-casbin-domains.query';
import { PaginationResult } from '@src/shared/prisma/pagination';

@ApiTags('Casbin Domain - Module')
@Controller('casbin-domain')
export class CasbinDomainController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated Casbin Domains',
  })
  @ApiResponseDoc({ type: CasbinDomainReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageCasbinDomainsQueryDto,
  ): Promise<ApiRes<PaginationResult<CasbinDomainProperties>>> {
    const query = new PageCasbinDomainsQuery({
      current: queryDto.current,
      size: queryDto.size,
      name: queryDto.name,
      status: queryDto.status,
    });
    const result = await this.queryBus.execute<
      PageCasbinDomainsQuery,
      PaginationResult<CasbinDomainProperties>
    >(query);
    return ApiRes.success(result);
  }
}
