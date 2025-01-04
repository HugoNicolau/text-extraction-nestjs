import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { Readable } from 'stream';

@Injectable()
export class OcrService {
  constructor(private httpService: HttpService) {}

  async extractText(imageBuffer: Buffer): Promise<string> {
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
        this.httpService.post('http://localhost:8000/extract-text/', formData, {
          headers: {
            ...formData.getHeaders(),
          },
        }),
      );
      console.log(response.data.text);
      return response.data.text;
    } catch (error) {
      throw new Error(`Error calling FastAPI: ${error.message}`);
    }
  }
}
