import { Injectable } from '@nestjs/common';
import { Incident, ProblemStatus } from '@prisma/client';

import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateProblemDto } from './dto/create-problem.dto';

@Injectable()
export class ProblemService {
  constructor(private readonly prisma: PrismaService) {}

  async analyzeIncidents(incidents: Incident[]) {
    const grouped = new Map<string, Incident[]>();

    for (const incident of incidents) {
      const key = `${incident.category}:${incident.component}`;
      const current = grouped.get(key) ?? [];
      current.push(incident);
      grouped.set(key, current);
    }

    return [...grouped.entries()]
      .filter(([, bucket]) => bucket.length >= 2)
      .map(([key, bucket]) => {
        const [category, component] = key.split(':');
        return {
          signature: key,
          category,
          component,
          incidents: bucket.map((item) => item.id),
          suggestedRootCause: `Repeated failures in ${component} (${category})`,
        };
      });
  }

  async recordKnownError(problem: CreateProblemDto) {
    return this.prisma.problem.create({
      data: {
        incidentIds: problem.incidentIds,
        rootCause: problem.rootCause,
        workaround: problem.workaround,
        permanentFix: problem.permanentFix,
        status: problem.status ?? ProblemStatus.KNOWN_ERROR,
      },
    });
  }

  async applyWorkaround(problemId: string) {
    return this.prisma.problem.update({
      where: { id: problemId },
      data: { status: ProblemStatus.INVESTIGATING },
    });
  }

  async getAllProblems() {
    return this.prisma.problem.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
