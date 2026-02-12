import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResolveIncidentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  resolution!: string;
}
