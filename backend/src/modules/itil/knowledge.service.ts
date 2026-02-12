import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateKnowledgeArticleDto } from './dto/create-knowledge-article.dto';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const normalized = query.trim();
    if (!normalized) {
      return [];
    }

    return this.prisma.knowledgeArticle.findMany({
      where: {
        OR: [
          { title: { contains: normalized, mode: 'insensitive' } },
          { category: { contains: normalized, mode: 'insensitive' } },
          { problem: { contains: normalized, mode: 'insensitive' } },
          { solution: { contains: normalized, mode: 'insensitive' } },
          { tags: { has: normalized } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(payload: CreateKnowledgeArticleDto) {
    return this.prisma.knowledgeArticle.create({
      data: {
        title: payload.title,
        category: payload.category,
        problem: payload.problem,
        solution: payload.solution,
        tags: payload.tags,
        relatedIncidents: payload.relatedIncidents,
      },
    });
  }

  async getByCategory(category: string) {
    return this.prisma.knowledgeArticle.findMany({
      where: { category: { equals: category, mode: 'insensitive' } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getAll() {
    return this.prisma.knowledgeArticle.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 300,
    });
  }
}
