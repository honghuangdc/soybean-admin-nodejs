import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [CqrsModule],
  exports: [CqrsModule],
})
export class GlobalCqrsModule {}
