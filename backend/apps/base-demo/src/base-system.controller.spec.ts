import { Test, TestingModule } from '@nestjs/testing';

import { BaseSystemController } from './base-system.controller';
import { BaseSystemService } from './base-system.service';

describe('BaseSystemController', () => {
  let baseSystemController: BaseSystemController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BaseSystemController],
      providers: [BaseSystemService],
    }).compile();

    baseSystemController = app.get<BaseSystemController>(BaseSystemController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(baseSystemController.getHello()).toBe('Hello World!');
    });
  });
});
