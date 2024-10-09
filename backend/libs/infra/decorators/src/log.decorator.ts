import { SetMetadata } from '@nestjs/common';

interface LogOptions {
  logParams?: boolean;
  logBody?: boolean;
  logResponse?: boolean;
}

export const LOG_KEY = 'log';
export const Log = (
  moduleName: string,
  description: string,
  options?: LogOptions,
) => SetMetadata(LOG_KEY, { moduleName, description, ...options });
