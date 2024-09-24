import cluster from 'node:cluster';

import fastifyCompress from '@fastify/compress';
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';

import { initDocSwagger } from '@lib/bootstrap/swagger/init-doc.swagger';
import { ConfigKeyPaths, IAppConfig, ICorsConfig } from '@lib/config';
import { RedisUtility } from '@lib/shared/redis/redis.util';
import { isMainProcess } from '@lib/utils/env';

import { fastifyApp } from '@src/infra/adapter/fastify.adapter';

import { AppModule } from './app.module';

async function bootstrap() {
  await RedisUtility.client();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    { abortOnError: true },
  );

  const configService = app.get(ConfigService<ConfigKeyPaths>);

  const { port } = configService.get<IAppConfig>('app', { infer: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const corsConfig = configService.get<ICorsConfig>('cors', { infer: true });

  corsConfig.enabled && app.enableCors(corsConfig.corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      stopAtFirstError: true,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0];
            return e.constraints![rule];
          })[0],
        ),
    }),
  );

  app.setGlobalPrefix('v1');
  initDocSwagger(app, configService);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await app.register(fastifyCompress);

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
