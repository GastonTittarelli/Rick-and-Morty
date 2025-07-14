import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MinLength(10)
  @MaxLength(50)
  mail: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}