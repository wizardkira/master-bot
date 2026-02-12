import {
  Incident,
  IncidentCategory,
  IncidentStatus,
  Problem,
  ProblemStatus,
  Severity,
} from '@prisma/client';

export interface CreateIncidentParams {
  severity: Severity;
  category: IncidentCategory;
  component: string;
  description: string;
  errorCode?: string;
  errorMessage?: string;
  stack?: string;
  context: Record<string, unknown>;
}

export interface IncidentManager {
  createIncident(params: CreateIncidentParams): Promise<Incident>;
  resolveIncident(id: string, resolution: string): Promise<void>;
  escalate(id: string): Promise<void>;
  getActiveIncidents(): Promise<Incident[]>;
}

export interface ProblemManager {
  analyzeIncidents(incidents: Incident[]): Promise<Problem[]>;
  recordKnownError(problem: Problem): Promise<void>;
  applyWorkaround(problemId: string): Promise<void>;
}

export interface KnowledgeArticleModel {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  tags: string[];
  relatedIncidents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProblemModel {
  id: string;
  incidents: string[];
  rootCause: string;
  workaround?: string;
  permanentFix?: string;
  status: ProblemStatus;
}

export interface IncidentModel {
  id: string;
  timestamp: Date;
  severity: Severity;
  category: IncidentCategory;
  component: string;
  description: string;
  status: IncidentStatus;
}
