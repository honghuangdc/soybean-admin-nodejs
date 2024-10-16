import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseDemoService {
  getHello(): string {
    return 'Hello World!';
  }
}
