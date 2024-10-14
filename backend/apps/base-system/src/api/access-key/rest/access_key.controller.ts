import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AccessKeyCreateCommand } from '@app/base-system/lib/bounded-contexts/access-key/commands/access_key-create.command';
import { AccessKeyDeleteCommand } from '@app/base-system/lib/bounded-contexts/access-key/commands/access_key-delete.command';
import {
  AccessKeyProperties,
  AccessKeyReadModel,
} from '@app/base-system/lib/bounded-contexts/access-key/domain/access_key.read.model';
import { PageAccessKeysQuery } from '@app/base-system/lib/bounded-contexts/access-key/queries/page-access_key.query';

import { ApiResponseDoc } from '@lib/infra/decorators/api-result.decorator';
import { ApiRes } from '@lib/infra/rest/res.response';
import { BUILT_IN } from '@lib/shared/prisma/db.constant';
import { PaginationResult } from '@lib/shared/prisma/pagination';

import { AccessKeyCreateDto } from '../dto/access_key.dto';
import { PageAccessKeysQueryDto } from '../dto/page-access_key.dto';

@ApiTags('AccessKey - Module')
@Controller('access-key')
export class AccessKeyController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated AccessKeys',
  })
  @ApiResponseDoc({ type: AccessKeyReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageAccessKeysQueryDto,
    @Request() req: any,
  ): Promise<ApiRes<PaginationResult<AccessKeyProperties>>> {
    const query = new PageAccessKeysQuery({
      current: queryDto.current,
      size: queryDto.size,
      domain: req.user.domain === BUILT_IN ? queryDto.domain : req.user.domain,
      status: queryDto.status,
    });
    const result = await this.queryBus.execute<
      PageAccessKeysQuery,
      PaginationResult<AccessKeyProperties>
    >(query);
    return ApiRes.success(result);
  }

  @Post()
  @ApiOperation({ summary: 'Create a New AccessKey' })
  @ApiResponse({
    status: 201,
    description: 'The accessKey has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createAccessKey(
    @Body() dto: AccessKeyCreateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new AccessKeyCreateCommand(
        req.user.domain === BUILT_IN ? dto.domain : req.user.domain,
        dto.description,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a AccessKey' })
  @ApiResponse({
    status: 201,
    description: 'The accessKey has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteAccessKey(@Param('id') id: string): Promise<ApiRes<null>> {
    await this.commandBus.execute(new AccessKeyDeleteCommand(id));
    return ApiRes.ok();
  }
}
