import { createHash } from 'crypto';
import * as fs from 'fs/promises';

import { Controller, Get, Post, Req } from '@nestjs/common';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';

import { ApiResponseDoc } from '@lib/infra/decorators/api-result.decorator';
import { Public } from '@lib/infra/decorators/public.decorator';
import { ApiRes } from '@lib/infra/rest/res.response';

import { BaseDemoService } from './base-demo.service';

@Controller()
export class BaseDemoController {
  constructor(private readonly baseDemoService: BaseDemoService) {}

  @Get()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Public()
  getHello(): string {
    return this.baseDemoService.getHello();
  }

  @Post('upload')
  @Public()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '文件上传' })
  @ApiResponseDoc({ type: String, isArray: true })
  async uploadFiles(@Req() req: FastifyRequest) {
    /**
     * fastify/multipart
     * fastify有几种文件上传中间件,单总体来说都谈不上好用
     * 很多第三方中间件会选择用decorator来实现,但经过考虑还是用最简单的fastify/multipart
     * https://github.com/fastify/fastify-multipart
     * 此处仅给出最简单使用案例,具体业务逻辑自行拓展
     */
    const parts = req.files();
    const formFields: Record<string, any> = {};
    const uploadPromises = [];

    const today = new Date();
    const date = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    const baseDir = '.file';
    const targetDir = `${baseDir}/pic/application/${date}`;
    await fs.mkdir(targetDir, { recursive: true });

    for await (const part of parts) {
      if (part.fields) {
        Object.entries(part.fields).forEach(([key, value]) => {
          if (
            value &&
            'type' in value &&
            value.type === 'field' &&
            'value' in value
          ) {
            formFields[key] = value.value;
          }
        });
      }

      const fileBuffer = await part.toBuffer();
      const md5 = createHash('md5')
        .update(new Uint8Array(fileBuffer))
        .digest('hex');
      const extension = part.filename.split('.').pop();
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(2, 15);
      const fileName = `${md5}-${timestamp}-${random}.${extension}`;
      const filePath = `${targetDir}/${fileName}`;
      const relativePath = filePath;

      uploadPromises.push(
        fs.writeFile(filePath, fileBuffer).then(() => ({ path: relativePath })),
      );
    }

    const results = await Promise.all(uploadPromises);

    if (results.length === 0) {
      return ApiRes.error(400, 'No files uploaded.');
    }

    console.log('Form fields:', formFields);

    const paths = results.map((result) => result.path);
    return ApiRes.success({
      files: paths,
      fields: formFields,
    });
  }
}
