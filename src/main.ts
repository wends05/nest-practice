import { HttpStatus, StandardSchemaValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';
import { AppException } from './common/errors/app.exception.js';
import { AppExceptionFilter } from './common/errors/app.exception-filter.js';
import { ERROR_CODE } from './common/errors/error-codes.js';
import { env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  // enable shutdown hooks. Currently used for prisma connection shutdowns
  app.enableShutdownHooks();

  // use global pipes for request validation
  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      transform: true,
      exceptionFactory: (issues) =>
        new AppException(
          HttpStatus.BAD_REQUEST,
          ERROR_CODE.VALIDATION_FAILED,
          'Invalid Request',
          issues,
        ),
    }),
  );

  // use global exception filter
  app.useGlobalFilters(new AppExceptionFilter());

  // use cookie parser for session cookies
  app.use(cookieParser());

  // set a global prefix for all routes
  app.setGlobalPrefix('/api');

  await app.listen(env.PORT);
}
bootstrap();
