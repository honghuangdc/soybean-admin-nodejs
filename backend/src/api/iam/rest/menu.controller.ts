import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@src/infra/decorators/public.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import { MenuRoute } from '@src/lib/bounded-contexts/iam/menu/application/dto/route.dto';
import { MenuService } from '@src/lib/bounded-contexts/iam/menu/application/service/menu.service';
import { MenuCreateCommand } from '@src/lib/bounded-contexts/iam/menu/commands/menu-create.command';
import { MenuUpdateCommand } from '@src/lib/bounded-contexts/iam/menu/commands/menu-update.command';
import { MenuTreeProperties } from '@src/lib/bounded-contexts/iam/menu/domain/menu.read-model';
import { MenuIdsByUserIdAndDomainQuery } from '@src/lib/bounded-contexts/iam/menu/queries/menu-ids.by-user_id&domain.query';
import { MenusQuery } from '@src/lib/bounded-contexts/iam/menu/queries/menus.query';

import { RouteCreateDto, RouteUpdateDto } from '../dto/route.dto';

@ApiTags('Menu - Module')
@Controller('route')
export class MenuController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
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

  @Post()
  @ApiOperation({ summary: 'Create a New Route' })
  @ApiResponse({
    status: 201,
    description: 'The route has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createRoute(
    @Body() dto: RouteCreateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new MenuCreateCommand(
        dto.menuName,
        dto.menuType,
        dto.iconType,
        dto.icon,
        dto.routeName,
        dto.routePath,
        dto.component,
        dto.pathParam,
        dto.status,
        dto.activeMenu,
        dto.hideInMenu,
        dto.pid,
        dto.order,
        dto.i18nKey,
        dto.keepAlive,
        dto.constant,
        dto.href,
        dto.multiTab,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Put()
  @ApiOperation({ summary: 'Update a Route' })
  @ApiResponse({
    status: 201,
    description: 'The route has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateRoute(
    @Body() dto: RouteUpdateDto,
    @Request() req: any,
  ): Promise<ApiRes<null>> {
    await this.commandBus.execute(
      new MenuUpdateCommand(
        dto.id,
        dto.menuName,
        dto.menuType,
        dto.iconType,
        dto.icon,
        dto.routeName,
        dto.routePath,
        dto.component,
        dto.pathParam,
        dto.status,
        dto.activeMenu,
        dto.hideInMenu,
        dto.pid,
        dto.order,
        dto.i18nKey,
        dto.keepAlive,
        dto.constant,
        dto.href,
        dto.multiTab,
        req.user.uid,
      ),
    );
    return ApiRes.ok();
  }

  @Get('auth-route')
  @ApiOperation({
    summary: 'Authorized Routes',
  })
  async authRoute(@Request() req: any) {
    const result = await this.queryBus.execute<
      MenuIdsByUserIdAndDomainQuery,
      number[]
    >(new MenuIdsByUserIdAndDomainQuery(req.user.uid, req.user.domain));
    return ApiRes.success(result);
  }
}
