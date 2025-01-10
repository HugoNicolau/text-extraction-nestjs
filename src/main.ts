import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific options
  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.CORS_FRONT_DEPLOYMENT,
      process.env.CORS_FRONT_DEPLOYMENT2,
    ], // Allow requests from this origin
    credentials: true, // Allow credentials (cookies)
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
