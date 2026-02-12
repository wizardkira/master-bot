import { Injectable } from '@nestjs/common';
import { ChangeStatus } from '@prisma/client';

import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateChangeDto } from './dto/create-change.dto';

@Injectable()
export class ChangeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateChangeDto) {
    return this.prisma.change.create({
      data: {
        title: payload.title,
        description: payload.description,
        type: payload.type,
        impact: payload.impact,
        requestedBy: payload.requestedBy,
        scheduledFor: new Date(payload.scheduledFor),
        rollbackPlan: payload.rollbackPlan,
      },
    });
  }

  async updateStatus(id: string, status: ChangeStatus, approvedBy?: string) {
    return this.prisma.change.update({
      where: { id },
      data: { status, approvedBy },
    });
  }

  async list() {
    return this.prisma.change.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
