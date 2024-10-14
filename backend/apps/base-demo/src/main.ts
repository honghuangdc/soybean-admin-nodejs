import cluster from 'node:cluster';

import fastifyCompress from '@fastify/compress';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';

import { initDocSwagger } from '@lib/bootstrap/swagger/init-doc.swagger';
import { ConfigKeyPaths, IAppConfig, ICorsConfig } from '@lib/config';
import { fastifyApp } from '@lib/infra/adapter/fastify.adapter';
import { RedisUtility } from '@lib/shared/redis/redis.util';
import { isMainProcess } from '@lib/utils/env';

import { BaseSystemModule } from './base-system.module';

async function bootstrap() {
  await RedisUtility.client();

  const app = await NestFactory.create<NestFastifyApplication>(
    BaseSystemModule,
    fastifyApp,
    { abortOnError: true },
  );

  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port } = configService.get<IAppConfig>('app', { infer: true });
  const corsConfig = configService.get<ICorsConfig>('cors', { infer: true });

  useContainer(app.select(BaseSystemModule), { fallbackOnErrors: true });

  if (corsConfig.enabled) {
    app.enableCors(corsConfig.corsOptions);
  }

  const GLOBAL_PREFIX = 'v1';
  app.setGlobalPrefix(GLOBAL_PREFIX);

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
