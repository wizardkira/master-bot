import { ProblemStatus } from '@prisma/client';

export interface ProblemEntity {
  id: string;
  incidentIds: string[];
  rootCause: string;
  workaround?: string | null;
  permanentFix?: string | null;
  status: ProblemStatus;
  createdAt: Date;
  updatedAt: Date;
}
