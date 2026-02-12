import { Module } from '@nestjs/common';

import { WebsocketModule } from '../websocket/websocket.module';
import { ChangeController } from './controllers/change.controller';
import { IncidentController } from './controllers/incident.controller';
import { KnowledgeController } from './controllers/knowledge.controller';
import { ProblemController } from './controllers/problem.controller';
import { ChangeService } from './change.service';
import { IncidentService } from './incident.service';
import { KnowledgeService } from './knowledge.service';
import { ProblemService } from './problem.service';

@Module({
  imports: [WebsocketModule],
  controllers: [
    IncidentController,
    KnowledgeController,
    ProblemController,
    ChangeController,
  ],
  providers: [IncidentService, ProblemService, KnowledgeService, ChangeService],
  exports: [IncidentService, ProblemService, KnowledgeService, ChangeService],
})
export class ItilModule {}
