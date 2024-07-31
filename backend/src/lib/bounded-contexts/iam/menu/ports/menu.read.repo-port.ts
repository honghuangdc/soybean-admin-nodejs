import { MenuProperties, MenuTreeProperties } from '../domain/menu.read-model';

export interface MenuReadRepoPort {
  getMenuById(id: number): Promise<MenuProperties | null>;

  findMenusByRoleCode(
    roleCode: string[],
    domain: string,
  ): Promise<Readonly<MenuProperties[]> | []>;

  getConstantRoutes(): Promise<Readonly<MenuProperties[]> | []>;

  findAll(): Promise<MenuTreeProperties[] | []>;

  findMenusByIds(ids: number[]): Promise<MenuProperties[]>;

  findMenuIdsByUserId(userId: string, domain: string): Promise<number[]>;
}
