import { MenuProperties, MenuTreeProperties } from '../domain/menu.read.model';

export interface MenuReadRepoPort {
  getChildrenMenuCount(id: number): Promise<number>;

  getMenuById(id: number): Promise<MenuProperties | null>;

  findMenusByRoleCode(
    roleCode: string[],
    domain: string,
  ): Promise<Readonly<MenuProperties[]> | []>;

  findMenusByRoleId(
    roleId: string,
    domain: string,
  ): Promise<Readonly<MenuProperties[]> | []>;

  getConstantRoutes(): Promise<Readonly<MenuProperties[]> | []>;

  findAll(): Promise<MenuTreeProperties[] | []>;

  findAllConstantMenu(constant: boolean): Promise<MenuTreeProperties[] | []>;

  findMenusByIds(ids: number[]): Promise<MenuProperties[]>;

  findMenuIdsByUserId(userId: string, domain: string): Promise<number[]>;
}
