import { IQuery } from '@nestjs/cqrs';

export class TokensByRefreshTokenQuery implements IQuery {
  constructor(readonly refreshToken: string) {}
}
