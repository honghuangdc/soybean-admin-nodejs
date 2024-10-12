import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseSystemService {
  getHello(): string {
    return 'Hello World!';
  }
}
