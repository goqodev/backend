import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FeatureLabel {
  @IsString()
  name!: string;

  @IsNumber()
  priceMin!: number;

  @IsNumber()
  priceMax!: number;
}

class ScopeModifierLabel {
  @IsString()
  label!: string;

  @IsString()
  value!: string;
}

class Labels {
  @IsString()
  projectType!: string;

  @IsString()
  designLevel!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScopeModifierLabel)
  scopeModifiers!: ScopeModifierLabel[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureLabel)
  features!: FeatureLabel[];

  @IsString()
  adBudget!: string;
}

export class CreateCalculatorSubmissionDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  projectType!: string;

  @IsOptional()
  @IsString()
  designLevel?: string | null;

  @IsArray()
  @IsString({ each: true })
  features!: string[];

  @IsObject()
  scopeModifiers!: Record<string, string>;

  @IsOptional()
  @IsString()
  adBudget?: string | null;

  @IsNumber()
  priceMin!: number;

  @IsNumber()
  priceMax!: number;

  @IsBoolean()
  isMonthly!: boolean;

  @ValidateNested()
  @Type(() => Labels)
  labels!: Labels;
}
