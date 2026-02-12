import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateProblemDto } from '../dto/create-problem.dto';
import { IncidentService } from '../incident.service';
import { ProblemService } from '../problem.service';

@Controller('problems')
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly incidentService: IncidentService,
  ) {}

  @Get()
  async getProblems() {
    return this.problemService.getAllProblems();
  }

  @Get('analysis')
  async analyzeIncidents() {
    const incidents = await this.incidentService.getActiveIncidents();
    return this.problemService.analyzeIncidents(incidents);
  }

  @Post()
  async createProblem(@Body() payload: CreateProblemDto) {
    return this.problemService.recordKnownError(payload);
  }

  @Post(':id/workaround')
  async applyWorkaround(@Param('id') id: string) {
    return this.problemService.applyWorkaround(id);
  }
}
