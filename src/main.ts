import { StandardSchemaValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  // enable shutdown hooks. Currently used for prisma connection shutdowns
  app.enableShutdownHooks();

  // use global pipes for request validation
  app.useGlobalPipes(new StandardSchemaValidationPipe({ transform: true }));

  // use cookie parser for session cookies
  app.use(cookieParser());

  // set a global prefix for all routes
  app.setGlobalPrefix('/api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
