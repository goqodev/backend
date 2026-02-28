import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

export class CreateContactSubmissionDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsArray()
  @IsString({ each: true })
  solutions!: string[];

  @IsArray()
  @IsString({ each: true })
  serviceTypes!: string[];

  @IsOptional()
  @IsString()
  budget?: string;
}
