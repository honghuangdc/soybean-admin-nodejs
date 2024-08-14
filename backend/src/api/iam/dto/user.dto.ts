import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'username cannot be empty' })
  username: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'domain must be a string' })
  @IsNotEmpty({ message: 'domain cannot be empty' })
  domain: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'nickName must be a string' })
  @IsNotEmpty({ message: 'nickName cannot be empty' })
  nickName: string;

  @ApiProperty({ type: 'string', required: false, nullable: true })
  @IsOptional()
  @IsString({ message: 'avatar must be a string or null' })
  @Type(() => String)
  avatar: string | null;

  @ApiProperty({ type: 'string', required: false, nullable: true })
  @IsOptional()
  @IsString({ message: 'email must be a string or null' })
  @Type(() => String)
  email: string | null;

  @ApiProperty({ type: 'string', required: false, nullable: true })
  @IsOptional()
  @IsString({ message: 'phoneNumber must be a string or null' })
  @Type(() => String)
  phoneNumber: string | null;
}

export class UserUpdateDto extends OmitType(UserCreateDto, [
  'password',
  'domain',
]) {
  @ApiProperty({ required: true })
  @IsString({ message: 'id must be a string' })
  @IsNotEmpty({ message: 'id cannot be empty' })
  id: string;
}
