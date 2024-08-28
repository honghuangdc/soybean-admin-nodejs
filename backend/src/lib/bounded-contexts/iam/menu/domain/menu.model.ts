import { AggregateRoot } from '@nestjs/cqrs';
import { MenuType, Status } from '@prisma/client';

import { MenuDeletedEvent } from './events/menu-deleted.event';
import {
  MenuCreateProperties,
  MenuProperties,
  MenuUpdateProperties,
} from './menu.read.model';

export interface IMenu {
  commit(): void;
}

export class Menu extends AggregateRoot implements IMenu {
  id: number;
  menuName: string;
  menuType: MenuType;
  routeName: string;
  routePath: string;
  component: string;
  status: Status;
  pid: number;
  order: number;
  constant: boolean;
  uid: string;
  iconType?: number;
  icon?: string;
  pathParam?: string;
  activeMenu?: string;
  hideInMenu?: boolean;
  i18nKey?: string;
  keepAlive?: boolean;
  href?: string;
  multiTab?: boolean;
  createdAt: Date;
  createdBy: string;

  static fromCreate(properties: MenuCreateProperties): Menu {
    return Object.assign(new Menu(), properties);
  }

  static fromUpdate(properties: MenuUpdateProperties): Menu {
    return Object.assign(new Menu(), properties);
  }

  static fromProp(properties: MenuProperties): Menu {
    return Object.assign(new Menu(), properties);
  }

  async deleted() {
    this.apply(new MenuDeletedEvent(this.id, this.routeName));
  }
}
