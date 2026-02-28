import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  sessionId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text!: string;
}
