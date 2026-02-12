import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateKnowledgeArticleDto {
  @IsString()
  @MaxLength(180)
  title!: string;

  @IsString()
  @MaxLength(100)
  category!: string;

  @IsString()
  problem!: string;

  @IsString()
  solution!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relatedIncidents: string[] = [];
}
