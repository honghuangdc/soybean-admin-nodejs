import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'domain must be a string.' })
  @IsNotEmpty({ message: 'domain cannot be empty.' })
  domain: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Role ID must be a string.' })
  @IsNotEmpty({ message: 'Role ID cannot be empty.' })
  roleId: string;

  @ApiProperty({
    type: String,
    isArray: true,
    required: true,
    description: 'A list of permission IDs that will be assigned to the role.',
  })
  @IsArray({ message: 'Permissions must be an array of permission IDs.' })
  @ArrayNotEmpty({ message: 'Permissions array cannot be empty.' })
  @IsString({ each: true, message: 'Each permission ID must be a string.' })
  @IsNotEmpty({ each: true, message: 'Permission ID cannot be empty.' })
  permissions: string[];
}
