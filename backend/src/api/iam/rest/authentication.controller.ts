import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { CacheConstant } from '@src/constants/cache.constant';
import { USER_AGENT } from '@src/constants/rest.constant';
import { Public } from '@src/infra/decorators/public.decorator';
import { ApiRes } from '@src/infra/rest/res.response';
import { PasswordIdentifierDTO } from '@src/lib/bounded-contexts/iam/authentication/application/dto/password-identifier.dto';
import { AuthenticationService } from '@src/lib/bounded-contexts/iam/authentication/application/service/authentication.service';
import { Ip2regionService } from '@src/shared/ip2region/ip2region.service';
import { RedisUtility } from '@src/shared/redis/services/redis.util';
import { getClientIpAndPort } from '@src/utils/ip.util';

import { PasswordLoginDto } from '../dto/password-login.dto';

@ApiTags('Authentication - Module')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private commandBus: CommandBus,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Password-based User Authentication',
    description:
      'Authenticates a user by verifying provided password credentials and issues a JSON Web Token (JWT) upon successful authentication.',
  })
  async login(
    @Body() dto: PasswordLoginDto,
    @Request() request: FastifyRequest,
  ): Promise<ApiRes<any>> {
    const { ip, port } = getClientIpAndPort(request);
    let region = 'Unknown';

    try {
      const ip2regionResult = await Ip2regionService.getSearcher().search(ip);
      region = ip2regionResult.region || region;
    } catch (_) {}
    const token = await this.authenticationService.execPasswordLogin(
      new PasswordIdentifierDTO(
        dto.identifier,
        dto.password,
        ip,
        region,
        request.headers[USER_AGENT] ?? '',
        'TODO',
        'PC',
        port,
      ),
    );
    return ApiRes.success(token);
  }

  @Public()
  @Post('refreshToken')
  async refreshToken(
    @Body() refreshToken: string,
    @Request() request: FastifyRequest,
  ): Promise<ApiRes<any>> {
    const { ip, port } = getClientIpAndPort(request);
    let region = 'Unknown';

    try {
      const ip2regionResult = await Ip2regionService.getSearcher().search(ip);
      region = ip2regionResult.region || region;
    } catch (_) {}
    //TODO DTO
    const token = await this.authenticationService.refreshToken(
      refreshToken,
      ip,
      region,
      request.headers[USER_AGENT] ?? '',
      'TODO',
      'PC',
      port,
    );
    return ApiRes.success(token);
  }

  @Get('getUserInfo')
  async getProfile(@Request() req: any): Promise<ApiRes<any>> {
    const user: IAuthentication = req.user;
    const userRoles = await RedisUtility.instance.smembers(
      `${CacheConstant.AUTH_TOKEN_PREFIX}${user.uid}`,
    );
    return ApiRes.success({
      userId: user.uid,
      userName: user.username,
      roles: userRoles,
    });
  }
}
