import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CreateKnowledgeArticleDto } from '../dto/create-knowledge-article.dto';
import { KnowledgeService } from '../knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  async getKnowledge(@Query('category') category?: string) {
    if (category) {
      return this.knowledgeService.getByCategory(category);
    }

    return this.knowledgeService.getAll();
  }

  @Post()
  async createKnowledge(@Body() payload: CreateKnowledgeArticleDto) {
    return this.knowledgeService.create(payload);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.knowledgeService.search(query);
  }

  @Get('category/:category')
  async getByCategory(@Param('category') category: string) {
    return this.knowledgeService.getByCategory(category);
  }
}
