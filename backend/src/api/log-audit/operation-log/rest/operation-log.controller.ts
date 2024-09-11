import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthActionVerb, AuthZGuard, UsePermissions } from '@src/infra/casbin';
import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import {
  OperationLogProperties,
  OperationLogReadModel,
} from '@src/lib/bounded-contexts/log-audit/operation-log/domain/operation-log.read.model';
import { PageOperationLogsQuery } from '@src/lib/bounded-contexts/log-audit/operation-log/queries/page-operation-logs.query';
import { PaginationResult } from '@src/shared/prisma/pagination';

import { PageOperationLogsQueryDto } from '../dto/page-operation-log.dto';

@UseGuards(AuthZGuard)
@ApiTags('Operation Log - Module')
@Controller('operation-log')
export class OperationLogController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @UsePermissions({ resource: 'operation-log', action: AuthActionVerb.READ })
  @ApiOperation({
    summary: 'Retrieve Paginated Operation Logs',
  })
  @ApiResponseDoc({ type: OperationLogReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageOperationLogsQueryDto,
  ): Promise<ApiRes<PaginationResult<OperationLogProperties>>> {
    const query = new PageOperationLogsQuery({
      current: queryDto.current,
      size: queryDto.size,
      username: queryDto.username,
      domain: queryDto.domain,
      moduleName: queryDto.moduleName,
      method: queryDto.method,
    });
    const result = await this.queryBus.execute<
      PageOperationLogsQuery,
      PaginationResult<OperationLogProperties>
    >(query);

    return ApiRes.success(result);
  }
}
