import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  OperationLogProperties,
  OperationLogReadModel,
} from '@app/base-system/lib/bounded-contexts/log-audit/operation-log/domain/operation-log.read.model';
import { PageOperationLogsQuery } from '@app/base-system/lib/bounded-contexts/log-audit/operation-log/queries/page-operation-logs.query';

import { AuthActionVerb, AuthZGuard, UsePermissions } from '@lib/infra/casbin';
import { ApiResponseDoc } from '@lib/infra/decorators/api-result.decorator';
import { Log } from '@lib/infra/decorators/log.decorator';
import { LogInterceptor } from '@lib/infra/interceptors/log.interceptor';
import { ApiRes } from '@lib/infra/rest/res.response';
import { PaginationResult } from '@lib/shared/prisma/pagination';

import { PageOperationLogsQueryDto } from '../dto/page-operation-log.dto';

@UseGuards(AuthZGuard)
@UseInterceptors(LogInterceptor)
@ApiTags('Operation Log - Module')
@Controller('operation-log')
export class OperationLogController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Log('OperationLog', 'Retrieve Paginated Operation Logs', {
    logParams: true,
    logBody: true,
    logResponse: false,
  })
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
