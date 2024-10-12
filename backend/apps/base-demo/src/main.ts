import { NestFactory } from '@nestjs/core';

import { BaseSystemModule } from './base-system.module';

async function bootstrap() {
  const app = await NestFactory.create(BaseSystemModule);
  await app.listen(3000);
}
bootstrap();
