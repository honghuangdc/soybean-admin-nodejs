import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import {
  UserProperties,
  UserReadModel,
} from '@src/lib/bounded-contexts/iam/authentication/domain/user.read-model';
import { PageUsersQuery } from '@src/lib/bounded-contexts/iam/authentication/queries/page-users.query';
import { PaginationResult } from '@src/shared/prisma/pagination';

import { PageUsersQueryDto } from '../dto/page-users.query-dto';

@ApiTags('User - Module')
@Controller('user')
export class UserController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated Users',
  })
  @ApiResponseDoc({ type: UserReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageUsersQueryDto,
  ): Promise<ApiRes<PaginationResult<UserProperties>>> {
    const query = new PageUsersQuery({
      current: queryDto.current,
      size: queryDto.size,
      username: queryDto.username,
      nickName: queryDto.nickName,
      status: queryDto.status,
    });
    const result = await this.queryBus.execute<
      PageUsersQuery,
      PaginationResult<UserProperties>
    >(query);
    return ApiRes.success(result);
  }
}
