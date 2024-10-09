import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OperationLogProperties } from '@src/lib/bounded-contexts/log-audit/operation-log/domain/operation-log.read.model';

import { LOG_OPERATION } from '@lib/constants/event-emitter-token.constant';
import { USER_AGENT } from '@lib/constants/rest.constant';
import { LOG_KEY } from '@lib/infra/decorators/log.decorator';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logMetadata = this.reflector.get(LOG_KEY, context.getHandler());

    if (!logMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    const { uid, username, domain }: IAuthentication = context
      .switchToHttp()
      .getRequest().user;

    const { moduleName, description, logParams, logBody, logResponse } =
      logMetadata;
    const startTime = new Date();

    return next.handle().pipe(
      tap((data) => {
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        const operationLog: OperationLogProperties = {
          userId: uid,
          username: username,
          domain: domain,
          moduleName,
          description,
          requestId: 'TODO',
          method: request.method,
          url: request.routeOptions.url,
          ip: request.ip,
          userAgent: request.headers[USER_AGENT] ?? null,
          params: logParams ? request.query : null,
          body: logBody ? request.body : null,
          response: logResponse ? data : null,
          startTime,
          endTime,
          duration,
        };

        setImmediate(() => {
          this.eventEmitter.emit(LOG_OPERATION, operationLog);
        });
      }),
    );
  }
}
