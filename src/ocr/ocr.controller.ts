import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { Express } from 'express';
import { CreateUserExtractionDto } from './dto/create-user-extraction.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractText(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserExtractionDto: CreateUserExtractionDto,
    @Headers('Authorization') authorization: string,
  ) {
    const jwtService = new JwtService({});
    const token = authorization.split(' ')[1];
    const decoded = jwtService.decode(token);
    const userId = decoded['sub'];
    const imageBuffer = file.buffer;

    return this.ocrService.extractText(
      imageBuffer,
      createUserExtractionDto.title,
      createUserExtractionDto.targetLanguage,
      createUserExtractionDto.improveExtraction,
      createUserExtractionDto.summarizeText,
      userId,
    );
  }
}
