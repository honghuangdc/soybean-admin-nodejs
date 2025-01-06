import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';

interface LogEntry {
  type: 'Request' | 'Response' | 'Error';
  timestamp: number;
  method: string;
  url: string;
  body?: any;
  query?: any;
  params?: any;
  headers?: any;
  statusCode?: number;
  error?: any;
  duration?: number;
}

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private static readonly SENSITIVE_FIELDS = [
    'password',
    'token',
    'secret',
    'authorization',
  ];
  private static readonly LOG_BUFFER_SIZE = 100;
  private static readonly FLUSH_INTERVAL = 5000;
  private readonly logBuffer: LogEntry[] = [];
  private flushTimeout: NodeJS.Timeout | null = null;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    process.on('beforeExit', () => this.flushLogs());
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const now = Date.now();

    const sanitizedBody = this.sanitizeData(request.body);
    const sanitizedQuery = this.sanitizeData(request.query);
    const sanitizedParams = this.sanitizeData(request.params);
    const sanitizedHeaders = this.sanitizeData(request.headers);

    this.addToBuffer({
      type: 'Request',
      timestamp: now,
      method,
      url,
      body: sanitizedBody,
      query: sanitizedQuery,
      params: sanitizedParams,
      headers: sanitizedHeaders,
    });

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const response = context.switchToHttp().getResponse<Response>();
          this.addToBuffer({
            type: 'Response',
            timestamp: Date.now(),
            method,
            url,
            statusCode: response.statusCode,
            duration: Date.now() - now,
          });
        },
        error: (error: any) => {
          this.addToBuffer({
            type: 'Error',
            timestamp: Date.now(),
            method,
            url,
            error: {
              message: error.message,
              stack: error.stack,
            },
            duration: Date.now() - now,
          });
        },
      }),
    );
  }

  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);

    if (this.logBuffer.length >= LoggerInterceptor.LOG_BUFFER_SIZE) {
      setImmediate(() => this.flushLogs());
      return;
    }

    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(() => {
        this.flushLogs();
        this.flushTimeout = null;
      }, LoggerInterceptor.FLUSH_INTERVAL);
    }
  }

  private flushLogs(): void {
    if (this.logBuffer.length === 0) {
      return;
    }

    const logs = this.logBuffer.splice(0, this.logBuffer.length);

    const requests = logs.filter((log) => log.type === 'Request');
    const errors = logs.filter((log) => log.type === 'Error');

    requests.forEach((log) => {
      this.logger.info('HTTP Request', {
        method: log.method,
        url: log.url,
        body: log.body,
        query: log.query,
        params: log.params,
        timestamp: new Date(log.timestamp).toISOString(),
      });
    });

    errors.forEach((log) => {
      this.logger.error('Request Error', {
        method: log.method,
        url: log.url,
        error: log.error,
        duration: log.duration,
        timestamp: new Date(log.timestamp).toISOString(),
      });
    });
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    if (typeof data === 'object') {
      const sanitized = { ...data };
      for (const key of Object.keys(sanitized)) {
        if (LoggerInterceptor.SENSITIVE_FIELDS.includes(key.toLowerCase())) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object') {
          sanitized[key] = this.sanitizeData(sanitized[key]);
        }
      }
      return sanitized;
    }

    return data;
  }
}
