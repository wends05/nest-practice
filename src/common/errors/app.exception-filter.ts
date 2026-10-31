import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from './app.exception';
import { ERROR_CODE } from './error-codes';

const STATUS_TO_CODE: Partial<Record<number, string>> = {
  [HttpStatus.UNAUTHORIZED]: ERROR_CODE.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ERROR_CODE.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ERROR_CODE.NOT_FOUND,
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
      return response.status(status).json({
        code: STATUS_TO_CODE[status] ?? ERROR_CODE.INTERNAL_ERROR,
        message: exception.message,
      });
    }

    this.logger.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ERROR_CODE.INTERNAL_ERROR,
      message: 'Something went wrong',
    });
  }
}
