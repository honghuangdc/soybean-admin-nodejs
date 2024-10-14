import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthorizationService } from '@app/base-system/lib/bounded-contexts/iam/authentication/application/service/authorization.service';
import { RoleAssignPermissionCommand } from '@app/base-system/lib/bounded-contexts/iam/authentication/commands/role-assign-permission.command';
import { RoleAssignRouteCommand } from '@app/base-system/lib/bounded-contexts/iam/authentication/commands/role-assign-route.command';
import { RoleAssignUserCommand } from '@app/base-system/lib/bounded-contexts/iam/authentication/commands/role-assign-user.command';
import { UserRoute } from '@app/base-system/lib/bounded-contexts/iam/menu/application/dto/route.dto';
import { MenuService } from '@app/base-system/lib/bounded-contexts/iam/menu/application/service/menu.service';

import { CacheConstant } from '@lib/constants/cache.constant';
import { AuthZGuard, UsePermissions } from '@lib/infra/casbin';
import { ApiRes } from '@lib/infra/rest/res.response';
import { RedisUtility } from '@lib/shared/redis/redis.util';
import { IAuthentication } from '@lib/typings/global';

import { AssignPermissionDto } from '../dto/assign-permission.dto';
import { AssignRouteDto } from '../dto/assign-route.dto';
import { AssignUserDto } from '../dto/assign-user.dto';

@UseGuards(AuthZGuard)
@ApiTags('Authorization - Module')
@Controller('authorization')
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly menuService: MenuService,
  ) {}

  @Post('assign-permission')
  @UsePermissions({ resource: 'authorization', action: 'assign-permission' })
  @ApiOperation({
    summary: 'Assign Permissions to Role',
    description:
      'Assigns a set of permissions to a specified role within a domain.',
  })
  async assignPermission(
    @Body() dto: AssignPermissionDto,
  ): Promise<ApiRes<null>> {
    await this.authorizationService.assignPermission(
      new RoleAssignPermissionCommand(dto.domain, dto.roleId, dto.permissions),
    );
    return ApiRes.ok();
  }

  @Post('assign-routes')
  @UsePermissions({ resource: 'authorization', action: 'assign-routes' })
  @ApiOperation({
    summary: 'Assign Routes to Role',
    description: 'Assigns a set of routes to a specified role within a domain.',
  })
  async assignRoutes(@Body() dto: AssignRouteDto): Promise<ApiRes<null>> {
    await this.authorizationService.assignRoutes(
      new RoleAssignRouteCommand(dto.domain, dto.roleId, dto.routeIds),
    );
    return ApiRes.ok();
  }

  @Post('assign-users')
  @UsePermissions({ resource: 'authorization', action: 'assign-users' })
  @ApiOperation({
    summary: 'Assign Users to Role',
    description: 'Assigns a set of users to a specified role',
  })
  async assignUsers(@Body() dto: AssignUserDto): Promise<ApiRes<null>> {
    await this.authorizationService.assignUsers(
      new RoleAssignUserCommand(dto.roleId, dto.userIds),
    );
    return ApiRes.ok();
  }

  @Get('getUserRoutes')
  @ApiOperation({
    summary: 'Get user routes',
    description:
      'Retrieve user-specific routes based on their roles and domain.',
  })
  async getUserRoutes(@Request() req: any): Promise<ApiRes<UserRoute>> {
    const user: IAuthentication = req.user;
    const userRoleCode = await RedisUtility.instance.smembers(
      `${CacheConstant.AUTH_TOKEN_PREFIX}${user.uid}`,
    );
    if (!userRoleCode || userRoleCode.length === 0) {
      throw new HttpException(
        'No roles found for the user',
        HttpStatus.NOT_FOUND,
      );
    }
    const routes = await this.menuService.getUserRoutes(
      userRoleCode,
      user.domain,
    );
    return ApiRes.success(routes);
  }
}
