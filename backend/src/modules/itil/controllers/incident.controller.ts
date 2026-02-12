import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateIncidentDto } from '../dto/create-incident.dto';
import { ResolveIncidentDto } from '../dto/resolve-incident.dto';
import { IncidentService } from '../incident.service';

@Controller('incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  async getIncidents() {
    return this.incidentService.getAllIncidents();
  }

  @Get('active')
  async getActiveIncidents() {
    return this.incidentService.getActiveIncidents();
  }

  @Post()
  async createIncident(@Body() payload: CreateIncidentDto) {
    return this.incidentService.createIncident(payload);
  }

  @Post(':id/resolve')
  async resolveIncident(@Param('id') id: string, @Body() payload: ResolveIncidentDto) {
    await this.incidentService.resolveIncident(id, payload.resolution);
    return { ok: true };
  }
}
