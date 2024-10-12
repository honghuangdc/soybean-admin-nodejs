import { ApiProperty } from '@nestjs/swagger';
import { Status, MenuType } from '@prisma/client';

import { UpdateAuditInfo } from '@lib/shared/prisma/db.constant';
import {
  CreationAuditInfoProperties,
  UpdateAuditInfoProperties,
} from '@lib/typings/global';

export type MenuEssentialProperties = Readonly<
  Required<{
    id: number;
    menuType: MenuType;
    menuName: string;
    routeName: string;
    routePath: string;
    component: string;
    status: Status;
    pid: number;
    order: number;
    constant: boolean;
  }>
>;

export type MenuOptionalProperties = Readonly<
  Partial<{
    iconType: number | null;
    icon: string | null;
    pathParam: string | null;
    activeMenu: string | null;
    hideInMenu: boolean | null;
    i18nKey: string | null;
    keepAlive: boolean | null;
    href: string | null;
    multiTab: boolean | null;
  }>
>;

export type MenuProperties = MenuEssentialProperties &
  Required<MenuOptionalProperties>;

export type MenuTreeProperties = MenuProperties & {
  children?: MenuTreeProperties[];
};

export type MenuCreateProperties = MenuProperties & CreationAuditInfoProperties;

export type MenuUpdateProperties = MenuProperties & UpdateAuditInfoProperties;

export class MenuReadModel extends UpdateAuditInfo {
  @ApiProperty({ description: 'The unique identifier of the menu', example: 1 })
  id: number;

  @ApiProperty({ description: 'Type of the menu' })
  menuType: MenuType;

  @ApiProperty({ description: 'Name of the menu', example: 'Settings' })
  menuName: string;

  @ApiProperty({
    description: 'Unique route name of the menu',
    example: 'settings',
  })
  routeName: string;

  @ApiProperty({ description: 'Path for the menu route', example: '/settings' })
  routePath: string;

  @ApiProperty({
    description: 'Component associated with the menu',
    example: 'SettingsComponent',
  })
  component: string;

  @ApiProperty({
    description: 'Status of the menu',
    enum: Object.values(Status),
  })
  status: Status;

  @ApiProperty({ description: 'Parent ID of the menu', example: '0' })
  pid: number;

  @ApiProperty({ description: 'Order of the menu in the list', example: 1 })
  order: number;

  @ApiProperty({
    description: 'Icon type ID of the menu',
    example: 1,
    required: false,
    nullable: true,
  })
  iconType: number | null;

  @ApiProperty({
    description: 'Icon of the menu',
    example: 'fa fa-settings',
    required: false,
    nullable: true,
  })
  icon: string | null;

  @ApiProperty({
    description: 'Additional parameters for the menu route',
    example: 'userId=123',
    required: false,
    nullable: true,
  })
  pathParam: string | null;

  @ApiProperty({
    description: 'Indicates if the menu is currently active',
    example: 'true',
    required: false,
    nullable: true,
  })
  activeMenu: string | null;

  @ApiProperty({
    description: 'If the menu should be hidden',
    example: 'false',
    required: false,
    nullable: true,
  })
  hideInMenu: boolean | null;

  @ApiProperty({
    description: 'Internationalization key for the menu',
    example: 'menu.settings',
    required: false,
    nullable: true,
  })
  i18nKey: string | null;

  @ApiProperty({
    description: 'Indicates if the menu should be kept alive',
    example: 'true',
    required: false,
    nullable: true,
  })
  keepAlive: boolean | null;

  @ApiProperty({
    description: 'Indicates if the menu is a constant feature',
    example: 'false',
    required: false,
  })
  constant: boolean;

  @ApiProperty({
    description: 'Hyperlink reference for the menu, if applicable',
    example: 'https://nestjs.com/',
    required: false,
    nullable: true,
  })
  href: string | null;

  @ApiProperty({
    description: 'Indicates if opening the menu will open a new tab',
    example: 'false',
    required: false,
    nullable: true,
  })
  multiTab: boolean | null;
}
