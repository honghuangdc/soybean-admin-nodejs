import {
  DynamicModule,
  Global,
  Module,
  Provider,
  OnApplicationShutdown,
} from '@nestjs/common';
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import * as winston from 'winston';

import { LoggerInterceptor } from './logger.interceptor';
import {
  LoggerOptions,
  LoggerAsyncOptions,
  LoggerOptionsFactory,
} from './logger.interface';

const LOGGER_OPTIONS = 'LOGGER_OPTIONS';

const defaultOptions: LoggerOptions = {
  console: true,
  file: true,
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
};

@Global()
@Module({})
export class LoggerModule implements OnApplicationShutdown {
  constructor(private moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    try {
      const logger = this.moduleRef.get<winston.Logger>(
        WINSTON_MODULE_PROVIDER,
      );
      if (logger && typeof logger.end === 'function') {
        await new Promise<void>((resolve) => {
          logger.end(() => resolve());
        });
      }
    } catch (error) {
      console.error('Error shutting down logger:', error);
    }
  }

  static forRoot(options: Partial<LoggerOptions> = {}): DynamicModule {
    const winstonOptions = this.createWinstonModuleOptions({
      ...defaultOptions,
      ...options,
    });

    return {
      module: LoggerModule,
      imports: [WinstonModule.forRoot(winstonOptions)],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggerInterceptor,
        },
      ],
      exports: [WinstonModule],
    };
  }

  static forRootAsync(options: LoggerAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: APP_INTERCEPTOR,
        useClass: LoggerInterceptor,
      },
    ];

    if (options.useClass) {
      providers.push(
        {
          provide: LOGGER_OPTIONS,
          useClass: options.useClass,
        },
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      );
    }

    const asyncWinstonModule = WinstonModule.forRootAsync({
      imports: options.imports,
      inject: options.inject || [],
      useFactory: async (...args: any[]) => {
        const loggerOptions = await this.resolveOptions(options, args);
        return this.createWinstonModuleOptions(loggerOptions);
      },
    });

    return {
      module: LoggerModule,
      imports: [...(options.imports || []), asyncWinstonModule],
      providers,
      exports: [WinstonModule],
    };
  }

  private static async resolveOptions(
    options: LoggerAsyncOptions,
    args: any[],
  ): Promise<LoggerOptions> {
    let loggerOptions: LoggerOptions = { ...defaultOptions };

    try {
      if (options.useFactory) {
        const factoryOptions = await options.useFactory(...args);
        loggerOptions = { ...loggerOptions, ...factoryOptions };
      } else if (options.useClass || options.useExisting) {
        const optionsFactory = await this.createLoggerOptionsFactory(options);
        const factoryOptions = await optionsFactory.createLoggerOptions();
        loggerOptions = { ...loggerOptions, ...factoryOptions };
      }
    } catch (error) {
      console.error('Failed to resolve logger options:', error);
    }

    return loggerOptions;
  }

  private static async createLoggerOptionsFactory(
    options: LoggerAsyncOptions,
  ): Promise<LoggerOptionsFactory> {
    if (options.useClass) {
      const FactoryClass = options.useClass;
      return new FactoryClass();
    }
    if (options.useExisting) {
      return options.useExisting as any;
    }
    throw new Error('Invalid logger module configuration');
  }

  private static createWinstonModuleOptions(
    options: LoggerOptions,
  ): winston.LoggerOptions {
    const transports: winston.transport[] = [];
    const formats = [
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
    ];

    if (options.console) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            ...formats,
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('App', {
              prettyPrint: true,
            }),
          ),
          handleExceptions: true,
          handleRejections: true,
        }),
      );
    }

    if (options.file) {
      const DailyRotateFile = require('winston-daily-rotate-file');
      transports.push(
        new DailyRotateFile({
          filename: options.filename,
          datePattern: options.datePattern,
          zippedArchive: options.zippedArchive,
          maxSize: options.maxSize,
          maxFiles: options.maxFiles,
          level: options.level,
          format: winston.format.combine(...formats, winston.format.json()),
          handleExceptions: true,
          handleRejections: true,
          maxRetries: 3,
          retryWrites: true,
          eol: '\n',
          tailable: true,
          frequency: '24h',
          auditFile: `${options.filename}.audit.json`,
        }),
      );
    }

    return {
      transports,
      exitOnError: false,
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.combine(...formats),
    };
  }
}
