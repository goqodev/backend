import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
  @IsString()
  @IsNotEmpty()
  metaTitle!: string;

  @IsString()
  @IsNotEmpty()
  metaDescription!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  intro!: string;
}

class TranslationsDto {
  @ValidateNested()
  @Type(() => TranslationDto)
  ro!: TranslationDto;

  @ValidateNested()
  @Type(() => TranslationDto)
  en!: TranslationDto;

  @ValidateNested()
  @Type(() => TranslationDto)
  ru!: TranslationDto;
}

class SectionTranslationDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  list?: string[];

  @IsArray()
  @IsOptional()
  items?: { subtitle: string; text: string }[];
}

class SectionTranslationsDto {
  @ValidateNested()
  @Type(() => SectionTranslationDto)
  ro!: SectionTranslationDto;

  @ValidateNested()
  @Type(() => SectionTranslationDto)
  en!: SectionTranslationDto;

  @ValidateNested()
  @Type(() => SectionTranslationDto)
  ru!: SectionTranslationDto;
}

class SectionDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsEnum(['text', 'list', 'items'])
  type!: 'text' | 'list' | 'items';

  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @ValidateNested()
  @Type(() => SectionTranslationsDto)
  translations!: SectionTranslationsDto;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsInt()
  readTime!: number;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ValidateNested()
  @Type(() => TranslationsDto)
  translations!: TranslationsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections!: SectionDto[];
}
