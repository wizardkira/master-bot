import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPerformance(): Promise<Record<string, unknown>> {
    const activePositions = await this.prisma.position.count({ where: { status: 'ACTIVE' } });
    const closedPositions = await this.prisma.position.count({ where: { status: 'CLOSED' } });

    return {
      activePositions,
      closedPositions,
      uptime: process.uptime(),
    };
  }

  async getPnL(): Promise<Record<string, unknown>> {
    const exits = await this.prisma.tradeExit.findMany();
    const totalPnl = exits.reduce((sum, exit) => sum + exit.pnl, 0);
    const avgPnlPercent = exits.length ? exits.reduce((sum, exit) => sum + exit.pnlPercent, 0) / exits.length : 0;

    return {
      totalPnl,
      avgPnlPercent,
      totalExits: exits.length,
    };
  }
}
