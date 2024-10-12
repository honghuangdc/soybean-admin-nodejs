import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AssignRouteDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'domain must be a string.' })
  @IsNotEmpty({ message: 'domain cannot be empty.' })
  domain: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Role ID must be a string.' })
  @IsNotEmpty({ message: 'Role ID cannot be empty.' })
  roleId: string;

  @ApiProperty({
    type: Number,
    isArray: true,
    required: true,
    description: 'A list of route IDs that will be assigned to the role.',
  })
  @IsArray({ message: 'Routes must be an array of route IDs.' })
  @ArrayNotEmpty({ message: 'Routes array cannot be empty.' })
  @IsInt({ each: true, message: 'Each route ID must be a number.' })
  @IsNotEmpty({ each: true, message: 'Routes ID cannot be empty.' })
  routeIds: number[];
}
