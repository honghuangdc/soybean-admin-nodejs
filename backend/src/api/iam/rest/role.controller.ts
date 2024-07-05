import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleCreateDto } from '@src/api/iam/dto/role-create.dto';
import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import { RoleCreateCommand } from '@src/lib/bounded-contexts/iam/role/commands/role-create.command';
import {
  RoleProperties,
  RoleReadModel,
} from '@src/lib/bounded-contexts/iam/role/domain/role.read-model';
import { PageRolesQuery } from '@src/lib/bounded-contexts/iam/role/queries/page-roles.query';
import { PaginationResult } from '@src/shared/prisma/pagination';

import { PageRolesQueryDto } from '../dto/page-roles.query-dto';

@ApiTags('Role - Module')
@Controller('role')
export class RoleController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated Roles',
  })
  @ApiResponseDoc({ type: RoleReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageRolesQueryDto,
  ): Promise<ApiRes<PaginationResult<RoleProperties>>> {
    const query = new PageRolesQuery({
      current: queryDto.current,
      size: queryDto.size,
      code: queryDto.code,
      name: queryDto.name,
      status: queryDto.status,
    });
    const result = await this.queryBus.execute<
      PageRolesQuery,
      PaginationResult<RoleProperties>
    >(query);
    return ApiRes.success(result);
  }

  @Post()
  @ApiOperation({ summary: 'Create a New Role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createRole(
    @Body() dto: RoleCreateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new RoleCreateCommand(
        dto.code,
        dto.name,
        dto.pid,
        dto.description,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }
}
