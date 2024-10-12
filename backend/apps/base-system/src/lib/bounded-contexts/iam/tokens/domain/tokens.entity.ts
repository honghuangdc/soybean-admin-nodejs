import { AggregateRoot } from '@nestjs/cqrs';

import { TokenStatus } from '../constants';

import { RefreshTokenUsedEvent } from './events/refreshtoken-used.event';
import { TokensProperties } from './tokens.read.model';

export interface ITokens {
  commit(): void;
}

export class TokensEntity extends AggregateRoot implements ITokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  status: string;
  readonly userId: string;
  readonly username: string;
  readonly domain: string;
  readonly ip: string;
  readonly address: string;
  readonly userAgent: string;
  readonly requestId: string;
  readonly type: string;
  readonly createdBy: string;
  readonly port?: number | null;

  constructor(properties: TokensProperties) {
    super();
    Object.assign(this, properties);
  }

  async refreshTokenCheck() {
    if (this.status !== TokenStatus.UNUSED) {
      throw new Error('Token has already been used.');
    } else {
      this.apply(
        new RefreshTokenUsedEvent(this.refreshToken, TokenStatus.USED),
      );
    }
  }
}
