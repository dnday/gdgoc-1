import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReviewRecruiterRequestDto {
  @IsString()
  @IsNotEmpty()
  action: 'approve' | 'reject';

  @IsString()
  @IsOptional()
  reviewNotes?: string;
}
