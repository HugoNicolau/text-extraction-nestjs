import { IsString, IsOptional } from 'class-validator';

export class CreateUserExtractionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  targetLanguage?: string;

  @IsString()
  @IsOptional()
  improveExtraction?: string;

  @IsString()
  @IsOptional()
  summarizeText?: string;
}
