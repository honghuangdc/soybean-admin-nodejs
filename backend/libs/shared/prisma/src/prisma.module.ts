import { Module, Provider } from '@nestjs/common';

import { PrismaService } from './prisma.service';

const providers: Provider[] = [PrismaService];

@Module({
  providers,
  exports: providers,
})
export class PrismaModule {}
