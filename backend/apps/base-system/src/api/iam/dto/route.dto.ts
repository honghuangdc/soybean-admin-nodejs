import { ApiProperty } from '@nestjs/swagger';
import { MenuType, Status } from '@prisma/client';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class RouteCreateDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'menuName must be a string' })
  @IsNotEmpty({ message: 'menuName cannot be empty' })
  menuName: string;

  @ApiProperty({ required: true, enum: MenuType })
  @IsNotEmpty({ message: 'menuType cannot be empty' })
  menuType: MenuType;

  @ApiProperty({ required: false, type: 'number', nullable: true })
  @ValidateIf((o) => o.iconType !== null)
  @IsNumber({}, { message: 'iconType must be a number' })
  iconType: number | null;

  @ApiProperty({ required: false, nullable: true, type: 'string' })
  @ValidateIf((o) => o.icon !== null)
  @IsString({ message: 'icon must be a string' })
  icon: string | null;

  @ApiProperty({ required: true })
  @IsString({ message: 'routeName must be a string' })
  @IsNotEmpty({ message: 'routeName cannot be empty' })
  routeName: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'routePath must be a string' })
  @IsNotEmpty({ message: 'routePath cannot be empty' })
  routePath: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'component must be a string' })
  @IsNotEmpty({ message: 'component cannot be empty' })
  component: string;

  @ApiProperty({ required: false, nullable: true, type: 'string' })
  @ValidateIf((o) => o.pathParam !== undefined)
  @IsString({ message: 'pathParam must be a string' })
  pathParam?: string | null;

  @ApiProperty({ required: true, enum: Status })
  @IsNotEmpty({ message: 'status cannot be empty' })
  status: Status;

  @ApiProperty({ required: false, nullable: true, type: 'string' })
  @ValidateIf((o) => o.activeMenu !== null)
  @IsString({ message: 'activeMenu must be a string' })
  activeMenu: string | null;

  @ApiProperty({ required: false, nullable: true, type: 'boolean' })
  @ValidateIf((o) => o.hideInMenu !== null)
  @IsBoolean({ message: 'hideInMenu must be a boolean' })
  hideInMenu: boolean | null;

  @ApiProperty({ required: true })
  @IsInt({ message: 'pid must be a integer' })
  @IsNotEmpty({ message: 'pid cannot be empty' })
  pid: number;

  @ApiProperty({ required: true })
  @IsInt({ message: 'order must be an integer' })
  @IsNotEmpty({ message: 'order cannot be empty' })
  order: number;

  @ApiProperty({ required: false, nullable: true, type: 'string' })
  @ValidateIf((o) => o.i18nKey !== null)
  @IsString({ message: 'i18nKey must be a string' })
  i18nKey: string | null;

  @ApiProperty({ required: false, nullable: true, type: 'boolean' })
  @ValidateIf((o) => o.keepAlive !== null)
  @IsBoolean({ message: 'keepAlive must be a boolean' })
  keepAlive: boolean | null;

  @ApiProperty({ required: true })
  @IsBoolean({ message: 'constant must be a boolean' })
  @IsNotEmpty({ message: 'constant cannot be empty' })
  constant: boolean;

  @ApiProperty({ required: false, nullable: true, type: 'string' })
  @ValidateIf((o) => o.href !== null)
  @IsString({ message: 'href must be a string' })
  href: string | null;

  @ApiProperty({ required: false, nullable: true, type: 'boolean' })
  @ValidateIf((o) => o.multiTab !== null)
  @IsBoolean({ message: 'multiTab must be a boolean' })
  multiTab: boolean | null;
}

export class RouteUpdateDto extends RouteCreateDto {
  @ApiProperty({ required: true })
  @IsInt({ message: 'id must be an integer' })
  @IsNotEmpty({ message: 'id cannot be empty' })
  id: number;
}
