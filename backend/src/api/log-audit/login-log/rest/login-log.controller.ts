import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthActionVerb, AuthZGuard, UsePermissions } from '@src/infra/casbin';
import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import {
  LoginLogProperties,
  LoginLogReadModel,
} from '@src/lib/bounded-contexts/log-audit/login-log/domain/login-log.read.model';
import { PageLoginLogsQuery } from '@src/lib/bounded-contexts/log-audit/login-log/queries/page-login-logs.query';

import { PaginationResult } from '@lib/shared/prisma/pagination';

import { PageLoginLogsQueryDto } from '../dto/page-login-log.dto';

@UseGuards(AuthZGuard)
@ApiTags('Login Log - Module')
@Controller('login-log')
export class LoginLogController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @UsePermissions({ resource: 'login-log', action: AuthActionVerb.READ })
  @ApiOperation({
    summary: 'Retrieve Paginated Login Logs',
  })
  @ApiResponseDoc({ type: LoginLogReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageLoginLogsQueryDto,
  ): Promise<ApiRes<PaginationResult<LoginLogProperties>>> {
    const query = new PageLoginLogsQuery({
      current: queryDto.current,
      size: queryDto.size,
      username: queryDto.username,
      domain: queryDto.domain,
      address: queryDto.address,
      type: queryDto.type,
    });
    const result = await this.queryBus.execute<
      PageLoginLogsQuery,
      PaginationResult<LoginLogProperties>
    >(query);

    return ApiRes.success(result);
  }
}
