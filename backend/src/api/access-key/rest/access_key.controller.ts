import { Body, Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiRes } from '@src/infra/rest/res.response';
import { AccessKeyCreateCommand } from '@src/lib/bounded-contexts/access-key/commands/access_key-create.command';
import { AccessKeyDeleteCommand } from '@src/lib/bounded-contexts/access-key/commands/access_key-delete.command';
import { BUILT_IN } from '@src/shared/prisma/db.constant';

import { AccessKeyCreateDto } from '../dto/access_key.dto';

@ApiTags('AccessKey - Module')
@Controller('access-key')
export class AccessKeyController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

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
  async deleteUser(@Param('id') id: string): Promise<ApiRes<null>> {
    await this.commandBus.execute(new AccessKeyDeleteCommand(id));
    return ApiRes.ok();
  }
}
