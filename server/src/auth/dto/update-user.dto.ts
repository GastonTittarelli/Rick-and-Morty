import {
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
  MinLength,
} from 'class-validator';



export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  nickname?: string;

  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  location?: string;
}