import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignUserDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'Role ID must be a string.' })
  @IsNotEmpty({ message: 'Role ID cannot be empty.' })
  roleId: string;

  @ApiProperty({
    type: String,
    isArray: true,
    required: true,
    description: 'A list of user IDs that will be assigned to the role.',
  })
  @IsArray({ message: 'Users must be an array of user IDs.' })
  @ArrayNotEmpty({ message: 'Users array cannot be empty.' })
  @IsString({ each: true, message: 'Each user ID must be a string.' })
  @IsNotEmpty({ each: true, message: 'Users ID cannot be empty.' })
  userIds: string[];
}
