import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  @MaxLength(50)
  street: string;

  @IsString()
  @MaxLength(50)
  city: string;

  @IsString()
  @MaxLength(50)
  location: string;

  @IsString()
  @MaxLength(50)
  country: string;

  @IsString()
  @MinLength(4)
  @MaxLength(4)
  cp: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  name: string;

  @IsEmail()
  @MinLength(10)
  @MaxLength(50)
  mail: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}