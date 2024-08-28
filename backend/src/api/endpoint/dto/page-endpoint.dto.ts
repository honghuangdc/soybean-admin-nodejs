import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginationParams } from '@src/infra/rest/pagination-params';

export class PageEndpointsQueryDto extends PaginationParams {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'code must be a string' })
  @IsNotEmpty({ message: 'code cannot be empty' })
  path?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  method?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'action must be a string' })
  @IsNotEmpty({ message: 'action cannot be empty' })
  action?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'resource must be a string' })
  @IsNotEmpty({ message: 'resource cannot be empty' })
  resource?: string;
}
