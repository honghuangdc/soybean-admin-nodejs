export enum ErrorCode {
  INTERNAL_SERVER_ERROR = 500,
  UNPROCESSABLE_ENTITY = 422,
}

export const ErrorMessages = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.UNPROCESSABLE_ENTITY]: 'Validation failed',
};

export class BizException extends Error {
  code: ErrorCode;
  message: string;

  constructor(code: ErrorCode, message?: string) {
    super(message);
    this.code = code;
    this.message = message ?? ErrorMessages[code];
  }
}
