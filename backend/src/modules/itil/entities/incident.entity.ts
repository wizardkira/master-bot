import {
  IncidentCategory,
  IncidentStatus,
  Severity,
} from '@prisma/client';

export interface IncidentEntity {
  id: string;
  timestamp: Date;
  severity: Severity;
  category: IncidentCategory;
  component: string;
  description: string;
  errorCode?: string | null;
  errorMessage?: string | null;
  stack?: string | null;
  context: Record<string, unknown>;
  status: IncidentStatus;
  assignedTo?: string | null;
  resolution?: string | null;
  resolvedAt?: Date | null;
}
