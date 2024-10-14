import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginationParams } from '@lib/infra/rest/pagination-params';

export class PageOperationLogsQueryDto extends PaginationParams {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'username cannot be empty' })
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'domain must be a string' })
  @IsNotEmpty({ message: 'domain cannot be empty' })
  domain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'moduleName must be a string' })
  @IsNotEmpty({ message: 'moduleName cannot be empty' })
  moduleName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'method must be a string' })
  @IsNotEmpty({ message: 'method cannot be empty' })
  method?: string;
}
