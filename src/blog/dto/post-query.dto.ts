import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class PostQueryDto {
  @IsString()
  @IsOptional()
  locale?: string = 'ro';

  @IsString()
  @IsOptional()
  category?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;
}
