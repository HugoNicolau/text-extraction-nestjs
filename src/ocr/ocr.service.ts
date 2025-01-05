import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import { OpenAI } from 'openai';

@Injectable()
export class OcrService {
  private openai: OpenAI;

  constructor(private httpService: HttpService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extractText(
    imageBuffer: Buffer,
    targetLanguage?: string,
    improve?: string,
  ): Promise<string> {
    try {
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

      if (improve) {
        console.log('Improving text using OpenAI...');
        const improvementResponse = await this.openai.completions.create({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `You are a helpful editor. Please improve the following text and correct any possible OCR mistakes: ${text}`,
          max_tokens: 1000,
        });
        text = improvementResponse.choices[0].text.trim();
        console.log('Improved text:', text);
      }

      if (targetLanguage) {
        console.log(`Translating text to ${targetLanguage} using OpenAI...`);
        const translationResponse = await this.openai.completions.create({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `You are a helpful translator. Translate the following text to ${targetLanguage}: ${text}`,
          max_tokens: 1000,
        });
        text = translationResponse.choices[0].text.trim();
        console.log('Translated text:', text);
      }
      return text;
    } catch (error) {
      throw new Error(`Error calling FastAPI: ${error.message}`);
    }
  }
}
