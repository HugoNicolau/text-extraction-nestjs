import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';
import { UserExtraction } from './ocr.entity';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([UserExtraction])],
  controllers: [OcrController],
  providers: [OcrService],
})
export class OcrModule {}
