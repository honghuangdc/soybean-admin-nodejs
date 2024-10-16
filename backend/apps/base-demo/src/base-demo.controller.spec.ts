import { Test, TestingModule } from '@nestjs/testing';

import { BaseDemoController } from './base-demo.controller';
import { BaseDemoService } from './base-demo.service';

describe('BaseDemoController', () => {
  let baseDemoController: BaseDemoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BaseDemoController],
      providers: [BaseDemoService],
    }).compile();

    baseDemoController = app.get<BaseDemoController>(BaseDemoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(baseDemoController.getHello()).toBe('Hello World!');
    });
  });
});
