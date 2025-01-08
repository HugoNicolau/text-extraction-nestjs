import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserExtractionDto } from './dto/create-user-extraction.dto';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('extract')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async extractText(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserExtractionDto: CreateUserExtractionDto,
    @Req() req: any,
  ) {
    const imageBuffer = file.buffer;
    const userId = req.user.id;

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
