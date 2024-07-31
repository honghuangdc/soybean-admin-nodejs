import { Menu } from '../domain/menu.model';

export interface MenuWriteRepoPort {
  update(menu: Menu): Promise<void>;
  save(menu: Menu): Promise<void>;
}
