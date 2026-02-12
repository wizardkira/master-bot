import { ChangeImpact, ChangeType } from '@prisma/client';
import { IsDateString, IsEnum, IsString, MaxLength } from 'class-validator';

export class CreateChangeDto {
  @IsString()
  @MaxLength(180)
  title!: string;

  @IsString()
  description!: string;

  @IsEnum(ChangeType)
  type!: ChangeType;

  @IsEnum(ChangeImpact)
  impact!: ChangeImpact;

  @IsString()
  requestedBy!: string;

  @IsDateString()
  scheduledFor!: string;

  @IsString()
  rollbackPlan!: string;
}
