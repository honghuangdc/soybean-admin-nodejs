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

import { UserCreateCommand } from '@app/base-system/lib/bounded-contexts/iam/authentication/commands/user-create.command';
import { UserDeleteCommand } from '@app/base-system/lib/bounded-contexts/iam/authentication/commands/user-delete.command';
import { UserUpdateCommand } from '@app/base-system/lib/bounded-contexts/iam/authentication/commands/user-update.command';
import {
  UserProperties,
  UserReadModel,
} from '@app/base-system/lib/bounded-contexts/iam/authentication/domain/user.read.model';
import { PageUsersQuery } from '@app/base-system/lib/bounded-contexts/iam/authentication/queries/page-users.query';

import { ApiResponseDoc } from '@lib/infra/decorators/api-result.decorator';
import { ApiRes } from '@lib/infra/rest/res.response';
import { PaginationResult } from '@lib/shared/prisma/pagination';

import { PageUsersDto } from '../dto/page-users.dto';
import { UserCreateDto, UserUpdateDto } from '../dto/user.dto';

@ApiTags('User - Module')
@Controller('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated Users',
  })
  @ApiResponseDoc({ type: UserReadModel, isPaged: true })
  async page(
    @Query() queryDto: PageUsersDto,
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

  @Post()
  @ApiOperation({ summary: 'Create a New User' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createUser(
    @Body() dto: UserCreateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new UserCreateCommand(
        dto.username,
        dto.password,
        dto.domain,
        dto.nickName,
        dto.avatar,
        dto.email,
        dto.phoneNumber,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Put()
  @ApiOperation({ summary: 'Update a User' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateUser(
    @Body() dto: UserUpdateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new UserUpdateCommand(
        dto.id,
        dto.username,
        dto.nickName,
        dto.avatar,
        dto.email,
        dto.phoneNumber,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a User' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteUser(@Param('id') id: string): Promise<ApiRes<null>> {
    await this.commandBus.execute(new UserDeleteCommand(id));
    return ApiRes.ok();
  }
}
