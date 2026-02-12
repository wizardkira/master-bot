import { IncidentCategory, Severity } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateIncidentDto {
  @IsEnum(Severity)
  severity!: Severity;

  @IsEnum(IncidentCategory)
  category!: IncidentCategory;

  @IsString()
  @MaxLength(120)
  component!: string;

  @IsString()
  @MaxLength(500)
  description!: string;

  @IsOptional()
  @IsString()
  errorCode?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsString()
  stack?: string;

  @IsObject()
  context!: Record<string, unknown>;
}
