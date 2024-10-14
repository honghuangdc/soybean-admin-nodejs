import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginationParams } from '@lib/infra/rest/pagination-params';

export class PageLoginLogsQueryDto extends PaginationParams {
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
  @IsString({ message: 'address must be a string' })
  @IsNotEmpty({ message: 'address cannot be empty' })
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'type must be a string' })
  @IsNotEmpty({ message: 'type cannot be empty' })
  type?: string;
}
