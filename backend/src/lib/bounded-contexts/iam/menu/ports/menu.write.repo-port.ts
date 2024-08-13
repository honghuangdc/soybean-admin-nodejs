import { Menu } from '../domain/menu.model';

export interface MenuWriteRepoPort {
  deleteById(id: number): Promise<void>;
  update(menu: Menu): Promise<void>;
  save(menu: Menu): Promise<void>;
}
