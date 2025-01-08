import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import { OpenAI } from 'openai';
import { TextExtractionResult } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExtraction } from './ocr.entity';

@Injectable()
export class OcrService {
  private openai: OpenAI;

  constructor(
    private httpService: HttpService,
    @InjectRepository(UserExtraction) private userExtractionRepository: any,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extractText(
    imageBuffer: Buffer,
    title: string,
    targetLanguage?: string,
    improveExtraction?: string,
    summarizeText?: string,
    userId?: string,
  ): Promise<TextExtractionResult> {
    try {
      const texts: TextExtractionResult = {
        title,
        originalExtraction: '',
        improvedExtraction: '',
        translatedText: '',
        summarizedText: '',
      };
      const formData = new FormData();

      const readableStream = new Readable();
      readableStream.push(imageBuffer);
      readableStream.push(null);

      formData.append('file', readableStream, {
        filename: 'image.jpg',
      });

      console.log('Calling FastAPI...');
      const response = await firstValueFrom(
        this.httpService.post(process.env.FASTAPI_URL, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        }),
      );
      let text = response.data.text;
      texts.originalExtraction = text;

      if (improveExtraction) {
        console.log('Improving text using OpenAI...');
        const improvementResponse = await this.openai.completions.create({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `Act as a meticulous editor. Enhance the clarity and correctness of the following text, correcting any OCR errors: ${text}`,
          max_tokens: 1000,
        });
        text = improvementResponse.choices[0].text.trim();
        texts.improvedExtraction = text;
        console.log('Improved text:', text);
      }

      if (targetLanguage) {
        console.log(`Translating text to ${targetLanguage} using OpenAI...`);
        const translationResponse = await this.openai.completions.create({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `Act as a skilled translator. Convert the following text into ${targetLanguage}, maintaining the original tone: ${text}`,
          max_tokens: 1000,
        });
        text = translationResponse.choices[0].text.trim();
        texts.translatedText = text;
        console.log('Translated text:', text);
      }

      if (summarizeText) {
        console.log('Summarizing text using OpenAI...');
        const summarizationResponse = await this.openai.completions.create({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `Act as a concise summarizer. Provide a brief summary of the following text in ${targetLanguage ?? 'its original language'}: ${text}`,
          max_tokens: 1000,
        });
        text = summarizationResponse.choices[0].text.trim();
        texts.summarizedText = text;
        console.log('Summarized text:', text);
      }

      const textWithUserId = { ...texts, idUser: userId };
      const ocrResult = this.userExtractionRepository.create(textWithUserId);
      await this.userExtractionRepository.save(ocrResult);
      return texts;
    } catch (error) {
      throw new Error(`Error calling FastAPI: ${error.message}`);
    }
  }
}
