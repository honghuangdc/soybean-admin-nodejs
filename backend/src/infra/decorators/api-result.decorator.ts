import { HttpStatus, applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import {
  RESPONSE_SUCCESS_CODE,
  RESPONSE_SUCCESS_MSG,
} from '@lib/constants/rest.constant';

export function ApiResponseDoc<T extends new (...args: any[]) => any>({
  type,
  isArray = false,
  isPaged = false,
  status = HttpStatus.OK,
}: {
  type: T;
  isArray?: boolean;
  isPaged?: boolean;
  status?: HttpStatus;
}) {
  const schema = getResponseSchema(type, isArray, isPaged);

  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: status,
      description: 'Auto-generated response schema',
      schema: schema,
    }),
  );
}

function getResponseSchema<T extends Type>(
  type: T,
  isArray: boolean,
  isPaged: boolean,
) {
  const dataSchema = isArray
    ? { type: 'array', items: { $ref: getSchemaPath(type) } }
    : { $ref: getSchemaPath(type) };

  const resultSchema = isPaged
    ? {
        type: 'object',
        properties: {
          current: { type: 'integer', example: 1 },
          size: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 100 },
          records: { type: 'array', items: { $ref: getSchemaPath(type) } },
        },
      }
    : dataSchema;

  return {
    type: 'object',
    properties: {
      code: {
        type: 'integer',
        example: RESPONSE_SUCCESS_CODE,
        description: 'Status code of the response',
      },
      message: {
        type: 'string',
        example: RESPONSE_SUCCESS_MSG,
        description: 'Description of the response',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: new Date().toISOString(),
        description: 'Timestamp of the response',
      },
      requestId: {
        type: 'string',
        example: 'req1',
        description: 'Request ID from the header',
      },
      path: {
        type: 'string',
        example: '/api/path',
        description: 'Request path',
      },
      data: resultSchema,
    },
  };
}
