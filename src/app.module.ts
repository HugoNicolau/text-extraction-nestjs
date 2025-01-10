import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OcrModule } from './ocr/ocr.module';
import { UserExtraction } from './ocr/ocr.entity';
import { User } from './auth/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'your_password',
      database: process.env.DB_NAME || 'ocr_db',
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [User, UserExtraction],
      synchronize: true,
    }),
    OcrModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
