import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { AuthActionVerb, AuthZGuard, UsePermissions } from '@src/infra/casbin';
import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import { CasbinRuleApiEndpointService } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/application/service/casbin-rule-api-endpoint.service';
import {
  EndpointProperties,
  EndpointReadModel,
  EndpointTreeProperties,
} from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/domain/endpoint.read.model';
import { EndpointsQuery } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/queries/endpoints.query';
import { PageEndpointsQuery } from '@src/lib/bounded-contexts/api-endpoint/api-endpoint/queries/page-endpoints.query';

import { PageEndpointsQueryDto } from '../dto/page-endpoint.dto';

@UseGuards(AuthZGuard)
@ApiTags('API Endpoint - Module')
@Controller('api-endpoint')
export class EndpointController {
  constructor(
    private queryBus: QueryBus,
    private casbinRuleApiEndpointService: CasbinRuleApiEndpointService,
  ) {}

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

  @Get('tree')
  @ApiOperation({
    summary: 'Endpoints',
  })
  async treeEndpoint() {
    const result = await this.queryBus.execute<
      EndpointsQuery,
      EndpointTreeProperties[]
    >(new EndpointsQuery());
    return ApiRes.success(result);
  }

  @Get('auth-api-endpoint/:roleCode')
  @ApiOperation({
    summary: 'Authorized API-Endpoints',
  })
  async authApiEndpoint(
    @Param('roleCode') roleCode: string,
    @Request() req: any,
  ) {
    const result = await this.casbinRuleApiEndpointService.authApiEndpoint(
      roleCode,
      req.user.domain,
    );
    return ApiRes.success(result);
  }
}
