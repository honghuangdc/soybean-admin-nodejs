import { ModuleMetadata, Type } from '@nestjs/common';

export interface LoggerOptions {
  console?: boolean;
  file?: boolean;
  filename?: string;
  datePattern?: string;
  zippedArchive?: boolean;
  maxSize?: string;
  maxFiles?: string;
  level?: string;
}

export interface LoggerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<LoggerOptions> | LoggerOptions;
  useClass?: Type<LoggerOptionsFactory>;
  useExisting?: Type<LoggerOptionsFactory>;
  inject?: any[];
}

export interface LoggerOptionsFactory {
  createLoggerOptions(): Promise<LoggerOptions> | LoggerOptions;
}
