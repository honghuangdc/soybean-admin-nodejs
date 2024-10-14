import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleCreateCommand } from '@app/base-system/lib/bounded-contexts/iam/role/commands/role-create.command';
import { RoleDeleteCommand } from '@app/base-system/lib/bounded-contexts/iam/role/commands/role-delete.command';
import { RoleUpdateCommand } from '@app/base-system/lib/bounded-contexts/iam/role/commands/role-update.command';
import {
  RoleProperties,
  RoleReadModel,
} from '@app/base-system/lib/bounded-contexts/iam/role/domain/role.read.model';
import { PageRolesQuery } from '@app/base-system/lib/bounded-contexts/iam/role/queries/page-roles.query';

import { ApiResponseDoc } from '@lib/infra/decorators/api-result.decorator';
import { ApiRes } from '@lib/infra/rest/res.response';
import { PaginationResult } from '@lib/shared/prisma/pagination';

import { PageRolesDto } from '../dto/page-roles.dto';
import { RoleCreateDto, RoleUpdateDto } from '../dto/role.dto';

@ApiTags('Role - Module')
@Controller('role')
export class RoleController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated Roles',
  })
  @ApiResponseDoc({ type: RoleReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageRolesDto,
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
        dto.status,
        dto.description,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Put()
  @ApiOperation({ summary: 'Update a Role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateRole(
    @Body() dto: RoleUpdateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new RoleUpdateCommand(
        dto.id,
        dto.code,
        dto.name,
        dto.pid,
        dto.status,
        dto.description,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteRole(@Param('id') id: string): Promise<ApiRes<null>> {
    await this.commandBus.execute(new RoleDeleteCommand(id));
    return ApiRes.ok();
  }
}
