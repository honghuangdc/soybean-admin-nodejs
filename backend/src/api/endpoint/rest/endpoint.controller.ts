import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PageEndpointsQueryDto } from '@src/api/endpoint/dto/page-endpoint.query-dto';
import { AuthActionVerb, AuthZGuard, UsePermissions } from '@src/infra/casbin';
import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import {
  EndpointProperties,
  EndpointReadModel,
} from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/domain/endpoint.read-model';
import { PageEndpointsQuery } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/queries/page-endpoints.query';
import { PaginationResult } from '@src/shared/prisma/pagination';

@UseGuards(AuthZGuard)
@ApiTags('API Endpoint - Module')
@Controller('api-endpoint')
export class EndpointController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @UsePermissions({ resource: 'api-endpoint', action: AuthActionVerb.READ })
  @ApiOperation({
    summary: 'Retrieve Paginated Api Endpoints',
  })
  @ApiResponseDoc({ type: EndpointReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageEndpointsQueryDto,
  ): Promise<ApiRes<PaginationResult<EndpointProperties>>> {
    const query = new PageEndpointsQuery({
      current: queryDto.current,
      size: queryDto.size,
      path: queryDto.path,
      method: queryDto.method,
      action: queryDto.action,
      resource: queryDto.resource,
    });
    const result = await this.queryBus.execute<
      PageEndpointsQuery,
      PaginationResult<EndpointProperties>
    >(query);
    return ApiRes.success(result);
  }
}
