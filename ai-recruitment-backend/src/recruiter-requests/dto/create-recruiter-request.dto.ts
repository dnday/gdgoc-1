import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateRecruiterRequestDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  companyWebsite?: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50, { message: 'Reason must be at least 50 characters long' })
  reason: string;
}
