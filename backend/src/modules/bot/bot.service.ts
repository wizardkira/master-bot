import { BadRequestException, Injectable } from '@nestjs/common';

import { QueueService } from '../../infrastructure/queue/queue.service';
import { LoggerService } from '../../utils/logger.util';
import { WebsocketGateway } from '../websocket/websocket.gateway';

type Mode = 'smart-sniper' | 'old-coins' | 'traction';
type ModeStatus = 'RUNNING' | 'STOPPED';

@Injectable()
export class BotService {
  private readonly statuses: Record<Mode, ModeStatus> = {
    'smart-sniper': 'STOPPED',
    'old-coins': 'STOPPED',
    traction: 'STOPPED',
  };

  constructor(
    private readonly websocketGateway: WebsocketGateway,
    private readonly queueService: QueueService,
    private readonly logger: LoggerService,
  ) {}

  async start(mode: Mode): Promise<{ mode: Mode; status: ModeStatus }> {
    this.ensureMode(mode);
    this.statuses[mode] = 'RUNNING';
    this.websocketGateway.emitBotStatus({ mode, status: 'RUNNING' });

    try {
      await this.queueService.enqueue('bot-mode', 'mode-start', {
        mode,
        startedAt: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.warn('Failed to enqueue mode-start job', {
        mode,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    }

    return { mode, status: 'RUNNING' };
  }

  async stop(mode: Mode): Promise<{ mode: Mode; status: ModeStatus }> {
    this.ensureMode(mode);
    this.statuses[mode] = 'STOPPED';
    this.websocketGateway.emitBotStatus({ mode, status: 'STOPPED' });

    try {
      await this.queueService.enqueue('bot-mode', 'mode-stop', {
        mode,
        stoppedAt: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.warn('Failed to enqueue mode-stop job', {
        mode,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    }

    return { mode, status: 'STOPPED' };
  }

  status(mode: Mode): { mode: Mode; status: ModeStatus } {
    this.ensureMode(mode);
    return { mode, status: this.statuses[mode] };
  }

  private ensureMode(mode: string): asserts mode is Mode {
    if (!['smart-sniper', 'old-coins', 'traction'].includes(mode)) {
      throw new BadRequestException('Invalid bot mode');
    }
  }
}
