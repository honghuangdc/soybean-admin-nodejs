import fs from 'fs';

import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import * as yaml from 'js-yaml';

import { CacheManagerModule } from './cache-manager/cache-manager.module';
import { OssModule } from './oss/oss.module';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        async () =>
          yaml.load(
            fs.readFileSync(
              `${process.env.NODE_ENV === 'dev' ? '' : './dist/'}src/shared/oss/oss.config.yaml`,
              'utf8',
            ),
          ),
      ],
      isGlobal: true,
    }),
    OssModule,
    // http
    HttpModule,
    // schedule
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: process.env.EVENT_EMITTER_WILDCARD === 'true',
      delimiter: process.env.EVENT_EMITTER_DELIMITER || '.',
      newListener: process.env.EVENT_EMITTER_NEW_LISTENER === 'true',
      removeListener: process.env.EVENT_EMITTER_REMOVE_LISTENER === 'true',
      maxListeners: parseInt(
        process.env.EVENT_EMITTER_MAX_LISTENERS || '20',
        10,
      ),
      ignoreErrors: process.env.EVENT_EMITTER_IGNORE_ERRORS === 'true',
    }),
    // prisma
    PrismaModule,
    CacheManagerModule,
  ],
  exports: [HttpModule, PrismaModule, CacheManagerModule],
})
export class SharedModule {}
