import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { LOG_KEY } from '@src/infra/decorators/log.decorator';
import { USER_AGENT, X_REQUEST_ID } from '@src/constants/rest.constant';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LOG_OPERATION } from '@src/constants/event-emitter-token.constant';
import { OperationLogProperties } from '@src/lib/bounded-contexts/log-audit/operation-log/domain/operation-log.read-model';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  constructor(
    private reflector: Reflector,
    private eventEmitter: EventEmitter2,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const logMetadata = this.reflector.get(LOG_KEY, context.getHandler());

    if (!logMetadata) {
      return next.handle();
    }

    const { uid, username, domain }: IAuthentication = context
      .switchToHttp()
      .getRequest().user;

    const { moduleName, description, logParams, logBody, logResponse } =
      logMetadata;
    const startTime = new Date();
    const requestId = Array.isArray(request.headers[X_REQUEST_ID])
      ? request.headers[X_REQUEST_ID][0]
      : request.headers[X_REQUEST_ID] || '';

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
          requestId,
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
