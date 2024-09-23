import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ISecurityConfig, SecurityConfig } from '@app/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: securityConfig.jwtSecret,
    });
  }

  async validate(payload: any) {
    await this.validateAuthenticationPayload(payload);
    return payload;
  }

  //TODO 此处可用class-validator验证处理
  assertIsIAuthentication(payload: any): asserts payload is IAuthentication {
    if (typeof payload.uid !== 'string') {
      throw new UnauthorizedException('Invalid UID');
    }
    if (typeof payload.username !== 'string') {
      throw new UnauthorizedException('Invalid username');
    }
    if (typeof payload.domain !== 'string') {
      throw new UnauthorizedException('Invalid domain');
    }
  }

  async validateAuthenticationPayload(payload: any): Promise<IAuthentication> {
    this.assertIsIAuthentication(payload);
    return payload;
  }
}
