import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/database/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class PositionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async getAll(): Promise<Array<Record<string, unknown>>> {
    const positions = await this.prisma.position.findMany({
      include: { token: true },
      orderBy: { entryTimestamp: 'desc' },
      take: 200,
    });

    return positions.map((position) => ({
      id: position.id,
      mint: position.token.mint,
      kpi: position.kpi,
      status: position.status,
      unrealizedPnLPercent: 0,
    }));
  }

  async getById(id: string): Promise<Record<string, unknown>> {
    const position = await this.prisma.position.findUnique({
      where: { id },
      include: { token: true, exits: true },
    });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    return position;
  }

  async closePosition(id: string): Promise<Record<string, unknown>> {
    const position = await this.prisma.position.update({
      where: { id },
      data: { status: 'CLOSED' },
      include: { token: true },
    });

    const payload = {
      id: position.id,
      mint: position.token.mint,
      kpi: position.kpi,
      status: position.status,
      unrealizedPnLPercent: 0,
    };

    this.websocketGateway.emitPositionEvent('position:closed', payload);
    return payload;
  }
}
