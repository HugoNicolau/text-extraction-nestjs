import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OcrService } from './ocr.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';

@Controller('ocr')
export class OcrController {
  constructor(private ocrService: OcrService) {}

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractText(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ text: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const text = await this.ocrService.extractText(file.buffer);
    return { text };
  }
}
