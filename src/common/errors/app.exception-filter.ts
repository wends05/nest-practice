import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from './app.exception.js';
import { ERROR_CODE, ErrorCode } from './error-codes.js';

const STATUS_TO_CODE: Partial<
  Record<number, { code: ErrorCode; message: string }>
> = {
  [HttpStatus.UNAUTHORIZED]: {
    code: ERROR_CODE.UNAUTHORIZED,
    message: 'Unauthorized',
  },
  [HttpStatus.FORBIDDEN]: {
    code: ERROR_CODE.FORBIDDEN,
    message: 'Forbidden',
  },
  [HttpStatus.NOT_FOUND]: {
    code: ERROR_CODE.NOT_FOUND,
    message: 'Not Found',
  },
  [HttpStatus.BAD_REQUEST]: {
    code: ERROR_CODE.BAD_REQUEST,
    message: 'Malformed Request',
  },
  [HttpStatus.PAYLOAD_TOO_LARGE]: {
    code: ERROR_CODE.PAYLOAD_TOO_LARGE,
    message: 'Payload Too Large',
  },
};

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof AppException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const matchStatus = STATUS_TO_CODE[status];
      return response.status(status).json({
        code: matchStatus ? matchStatus.code : ERROR_CODE.INTERNAL_ERROR,
        message: matchStatus ? matchStatus.message : exception.message,
      });
    }

    if (isClientError(exception)) {
      const matchStatus = STATUS_TO_CODE[exception.status];
      return response.status(exception.status).json({
        code: matchStatus ? matchStatus.code : ERROR_CODE.REQUEST_FAILED,
        message: matchStatus?.message ?? 'Request failed',
      });
    }
    this.logger.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ERROR_CODE.INTERNAL_ERROR,
      message: 'Something went wrong',
    });
  }
}

function isClientError(e: unknown): e is { status: number } {
  return (
    typeof e === 'object' &&
    e !== null &&
    'status' in e &&
    typeof e.status === 'number' &&
    e.status >= 400 &&
    e.status < 500
  );
}
