import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Incident, IncidentStatus, Prisma, Severity } from '@prisma/client';

import { PrismaService } from '../../infrastructure/database/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { MetricsService } from '../../observability/metrics.service';
import { LoggerService } from '../../utils/logger.util';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { CreateIncidentParams, IncidentManager } from './types/itil.types';

@Injectable()
export class IncidentService implements IncidentManager {
  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly metricsService: MetricsService,
    private readonly logger: LoggerService,
  ) {}

  async createIncident(params: CreateIncidentParams | CreateIncidentDto): Promise<Incident> {
    const context = (params.context ?? {}) as Prisma.InputJsonValue;

    const incident = await this.prisma.incident.create({
      data: {
        severity: params.severity,
        category: params.category,
        component: params.component,
        description: params.description,
        errorCode: params.errorCode,
        errorMessage: params.errorMessage,
        stack: params.stack,
        context,
        status: IncidentStatus.OPEN,
      },
    });

    this.metricsService.incidentCounter
      .labels(incident.severity, incident.category)
      .inc();

    this.websocketGateway.emitIncidentCreated(incident);
    this.websocketGateway.emitLog('error', `${incident.category}: ${incident.description}`);
    this.logger.error('Incident created', {
      incidentId: incident.id,
      severity: incident.severity,
      category: incident.category,
      component: incident.component,
    });

    return incident;
  }

  async resolveIncident(id: string, resolution: string): Promise<void> {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    await this.prisma.incident.update({
      where: { id },
      data: {
        resolution,
        status: IncidentStatus.RESOLVED,
        resolvedAt: new Date(),
      },
    });

    this.websocketGateway.emitLog('info', `Incident ${id} resolved`);
    this.logger.info('Incident resolved', { incidentId: id });
  }

  async escalate(id: string): Promise<void> {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    const nextSeverity = this.getNextSeverity(incident.severity);
    if (nextSeverity === incident.severity) {
      throw new BadRequestException('Incident already at maximum severity');
    }

    await this.prisma.incident.update({
      where: { id },
      data: {
        severity: nextSeverity,
        status: IncidentStatus.IN_PROGRESS,
      },
    });

    this.websocketGateway.emitLog('warn', `Incident ${id} escalated to ${nextSeverity}`);
    this.logger.warn('Incident escalated', { incidentId: id, severity: nextSeverity });
  }

  async getActiveIncidents(): Promise<Incident[]> {
    return this.prisma.incident.findMany({
      where: { status: { in: [IncidentStatus.OPEN, IncidentStatus.IN_PROGRESS] } },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getAllIncidents(): Promise<Incident[]> {
    return this.prisma.incident.findMany({
      orderBy: { timestamp: 'desc' },
      take: 500,
    });
  }

  private getNextSeverity(severity: Severity): Severity {
    if (severity === Severity.LOW) return Severity.MEDIUM;
    if (severity === Severity.MEDIUM) return Severity.HIGH;
    if (severity === Severity.HIGH) return Severity.CRITICAL;
    return Severity.CRITICAL;
  }
}
