import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply } from 'fastify';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

import {
  RESPONSE_SUCCESS_CODE,
  RESPONSE_SUCCESS_MSG,
} from '@lib/constants/rest.constant';
import { BYPASS_TRANSFORM_KEY } from '@lib/infra/decorators/bypass-transform.decorator';
import { ApiResponse } from '@lib/typings/global';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const bypassTransform = this.reflector.get<boolean>(
      BYPASS_TRANSFORM_KEY,
      context.getHandler(),
    );

    if (bypassTransform) return next.handle();

    context.switchToHttp().getResponse<FastifyReply>();

    return next.handle().pipe(
      timeout(3000),
      map((data) => ({
        code: RESPONSE_SUCCESS_CODE,
        message: RESPONSE_SUCCESS_MSG,
        data: data ?? null,
      })),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException('Request timed out');
        }
        throw err;
      }),
    );
  }
}
