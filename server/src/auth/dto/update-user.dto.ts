import {
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
  MinLength,
  ValidateIf,
} from 'class-validator';



export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.nickname !== '')
  @MinLength(3)
  @MaxLength(15)
  nickname?: string;

  @IsOptional()
  @ValidateIf((o) => o.profilePicture !== '')
  @IsUrl()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.location !== '')
  @MinLength(3)
  @MaxLength(50)
  location?: string;
}