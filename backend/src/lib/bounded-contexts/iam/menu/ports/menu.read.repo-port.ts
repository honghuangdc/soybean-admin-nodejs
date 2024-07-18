import { MenuProperties, MenuTreeProperties } from '../domain/menu.read-model';

export interface MenuReadRepoPort {
  findMenusByRoleCode(
    roleCode: string[],
    domain: string,
  ): Promise<Readonly<MenuProperties[]> | []>;

  getConstantRoutes(): Promise<Readonly<MenuProperties[]> | []>;

  findAll(): Promise<MenuTreeProperties[] | []>;
}
