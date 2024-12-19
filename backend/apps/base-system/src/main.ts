import cluster from 'node:cluster';

import fastifyCompress from '@fastify/compress';
import fastifyCsrf from '@fastify/csrf-protection';
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';

import { initDocSwagger } from '@lib/bootstrap/swagger/init-doc.swagger';
import { ConfigKeyPaths, IAppConfig, ICorsConfig } from '@lib/config';
import { fastifyApp } from '@lib/infra/adapter/fastify.adapter';
import { RedisUtility } from '@lib/shared/redis/redis.util';
import { isMainProcess } from '@lib/utils/env';

import { AppModule } from './app.module';

interface ValidationErrors {
  [key: string]: string[] | ValidationErrors;
}

const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  transformOptions: { enableImplicitConversion: true },
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors = formatErrors(errors);
    return new UnprocessableEntityException({
      message: 'Validation failed',
      errors: formattedErrors,
    });
  },
};

function formatErrors(
  errors: ValidationError[],
  parentPath: string = '',
): ValidationErrors {
  return errors.reduce((acc, error) => {
    const property = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      acc[property] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      const nestedErrors = formatErrors(error.children, property);
      // 合并嵌套错误
      acc[property] = { ...acc[property], ...nestedErrors };
    }

    return acc;
  }, {} as ValidationErrors);
}

async function bootstrap() {
  await RedisUtility.client();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    { abortOnError: true },
  );

  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port } = configService.get<IAppConfig>('app', { infer: true });
  const corsConfig = configService.get<ICorsConfig>('cors', { infer: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (corsConfig.enabled) {
    app.enableCors(corsConfig.corsOptions);
  }

  const GLOBAL_PREFIX = 'v1';
  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  initDocSwagger(app, configService);

  // @ts-ignore
  await app.register(fastifyCompress);
  // TODO
  await app.register(fastifyCsrf as any);

  await app.listen(port, '0.0.0.0', async () => {
    const url = await app.getUrl();
    const { pid } = process;
    const env = cluster.isPrimary;
    const prefix = env ? 'P' : 'W';

    if (!isMainProcess) return;

    const logger = new Logger('NestApplication');
    logger.log(`[${prefix + pid}] Server running on ${url}`);
  });
}

bootstrap();
