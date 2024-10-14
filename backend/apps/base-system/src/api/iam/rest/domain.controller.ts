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

import { DomainCreateCommand } from '@app/base-system/lib/bounded-contexts/iam/domain/commands/domain-create.command';
import { DomainDeleteCommand } from '@app/base-system/lib/bounded-contexts/iam/domain/commands/domain-delete.command';
import { DomainUpdateCommand } from '@app/base-system/lib/bounded-contexts/iam/domain/commands/domain-update.command';
import {
  DomainProperties,
  DomainReadModel,
} from '@app/base-system/lib/bounded-contexts/iam/domain/domain/domain.read.model';
import { PageDomainsQuery } from '@app/base-system/lib/bounded-contexts/iam/domain/queries/page-domains.query';

import { ApiResponseDoc } from '@lib/infra/decorators/api-result.decorator';
import { ApiRes } from '@lib/infra/rest/res.response';
import { PaginationResult } from '@lib/shared/prisma/pagination';

import { DomainCreateDto, DomainUpdateDto } from '../dto/domain.dto';
import { PageDomainsDto } from '../dto/page-domains.dto';

@ApiTags('Casbin Domain - Module')
@Controller('domain')
export class DomainController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated Casbin Domains',
  })
  @ApiResponseDoc({ type: DomainReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageDomainsDto,
  ): Promise<ApiRes<PaginationResult<DomainProperties>>> {
    const query = new PageDomainsQuery({
      current: queryDto.current,
      size: queryDto.size,
      name: queryDto.name,
      status: queryDto.status,
    });
    const result = await this.queryBus.execute<
      PageDomainsQuery,
      PaginationResult<DomainProperties>
    >(query);
    return ApiRes.success(result);
  }

  @Post()
  @ApiOperation({ summary: 'Create a New Domain' })
  @ApiResponse({
    status: 201,
    description: 'The domain has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createDomain(
    @Body() dto: DomainCreateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new DomainCreateCommand(
        dto.code,
        dto.name,
        dto.description,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Put()
  @ApiOperation({ summary: 'Update a Domain' })
  @ApiResponse({
    status: 201,
    description: 'The domain has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateDomain(
    @Body() dto: DomainUpdateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new DomainUpdateCommand(
        dto.id,
        dto.code,
        dto.name,
        dto.description,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Domain' })
  @ApiResponse({
    status: 201,
    description: 'The domain has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteDomain(@Param('id') id: string): Promise<ApiRes<null>> {
    await this.commandBus.execute(new DomainDeleteCommand(id));
    return ApiRes.ok();
  }
}
