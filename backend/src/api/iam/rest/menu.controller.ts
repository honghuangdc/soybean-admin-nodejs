import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@src/infra/decorators/public.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import { MenuRoute } from '@src/lib/bounded-contexts/iam/menu/application/dto/route.dto';
import { MenuService } from '@src/lib/bounded-contexts/iam/menu/application/service/menu.service';
import { MenuTreeProperties } from '@src/lib/bounded-contexts/iam/menu/domain/menu.read-model';
import { MenusQuery } from '@src/lib/bounded-contexts/iam/menu/queries/menus.query';

@ApiTags('Menu - Module')
@Controller('route')
export class MenuController {
  constructor(
    private queryBus: QueryBus,
    private menuService: MenuService,
  ) {}

  @Public()
  @Get('getConstantRoutes')
  @ApiOperation({
    summary: 'Get constant routes',
    description: 'Retrieve all constant routes available in the system.',
  })
  async getConstantRoutes(): Promise<ApiRes<MenuRoute[]>> {
    const result = await this.menuService.getConstantRoutes();
    return ApiRes.success(result);
  }

  @Get()
  @ApiOperation({
    summary: 'Routes',
  })
  async routes() {
    const result = await this.queryBus.execute<
      MenusQuery,
      MenuTreeProperties[]
    >(new MenusQuery());
    return ApiRes.success(result);
  }
}
