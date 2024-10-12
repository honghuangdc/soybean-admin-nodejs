import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleCreateDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'code must be a string' })
  @IsNotEmpty({ message: 'code cannot be empty' })
  code: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  name: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'pid must be a string' })
  @IsNotEmpty({ message: 'pid cannot be empty' })
  pid: string;

  @ApiProperty({ required: false })
  @IsEnum(Status, { message: 'Status must be a valid enum value' })
  status: Status;

  @ApiProperty({ type: 'string', required: false, nullable: true })
  @IsOptional()
  @IsString({ message: 'description must be a string or null' })
  @Type(() => String)
  description: string | null;
}

export class RoleUpdateDto extends RoleCreateDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'id must be a string' })
  @IsNotEmpty({ message: 'id cannot be empty' })
  id: string;
}
