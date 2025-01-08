import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';
import { UserExtraction } from './ocr.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserExtraction]),
    JwtAuthModule,
    UserModule,
  ],
  controllers: [OcrController],
  providers: [OcrService, JwtStrategy],
})
export class OcrModule {}
