import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DomainCreateDto, DomainUpdateDto } from '@src/api/iam/dto/domain.dto';
import { PageDomainsQueryDto } from '@src/api/iam/dto/page-domains-query.dto';
import { ApiResponseDoc } from '@src/infra/decorators/api-result.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import { DomainCreateCommand } from '@src/lib/bounded-contexts/iam/domain/commands/domain-create.command';
import { DomainUpdateCommand } from '@src/lib/bounded-contexts/iam/domain/commands/domain-update.command';
import {
  DomainProperties,
  DomainReadModel,
} from '@src/lib/bounded-contexts/iam/domain/domain/domain-read.model';
import { PageDomainsQuery } from '@src/lib/bounded-contexts/iam/domain/queries/page-domains.query';
import { PaginationResult } from '@src/shared/prisma/pagination';

@ApiTags('Casbin Domain - Module')
@Controller('domain')
export class DomainController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated Casbin Domains',
  })
  @ApiResponseDoc({ type: DomainReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageDomainsQueryDto,
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
}
