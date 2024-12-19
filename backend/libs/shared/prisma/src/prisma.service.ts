import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { isDevEnvironment } from '@lib/utils/env';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: isDevEnvironment
        ? [
            { level: 'query', emit: 'event' },
            { level: 'info', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
            { level: 'error', emit: 'stdout' },
          ]
        : [
            { level: 'warn', emit: 'stdout' },
            { level: 'error', emit: 'stdout' },
          ],
    });

    if (isDevEnvironment) {
      // @ts-expect-error
      this.$on('query', (event: Prisma.QueryEvent) => {
        console.log('Query: ' + event.query);
        console.log('Params: ' + event.params);
        console.log('Duration: ' + event.duration + 'ms');
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
