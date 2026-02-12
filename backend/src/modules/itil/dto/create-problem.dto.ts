import { ProblemStatus } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateProblemDto {
  @IsArray()
  @IsString({ each: true })
  incidentIds!: string[];

  @IsString()
  rootCause!: string;

  @IsOptional()
  @IsString()
  workaround?: string;

  @IsOptional()
  @IsString()
  permanentFix?: string;

  @IsOptional()
  @IsEnum(ProblemStatus)
  status?: ProblemStatus;
}
