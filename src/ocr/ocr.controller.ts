import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { Express } from 'express';
import { Multer } from 'multer';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractText(
    @UploadedFile() file: Express.Multer.File,
    @Body('targetLanguage') targetLanguage: string,
  ) {
    const imageBuffer = file.buffer;
    return this.ocrService.extractText(imageBuffer, targetLanguage);
  }
}
