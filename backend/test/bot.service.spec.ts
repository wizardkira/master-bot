import { BotService } from '../src/modules/bot/bot.service';

describe('BotService', () => {
  it('enqueues mode-start and emits status', async () => {
    const websocketGateway = {
      emitBotStatus: jest.fn(),
    };

    const queueService = {
      enqueue: jest.fn().mockResolvedValue('job-1'),
    };

    const logger = {
      warn: jest.fn(),
    };

    const service = new BotService(websocketGateway as never, queueService as never, logger as never);

    const result = await service.start('traction');

    expect(result).toEqual({ mode: 'traction', status: 'RUNNING' });
    expect(websocketGateway.emitBotStatus).toHaveBeenCalledWith({ mode: 'traction', status: 'RUNNING' });
    expect(queueService.enqueue).toHaveBeenCalledWith(
      'bot-mode',
      'mode-start',
      expect.objectContaining({ mode: 'traction' }),
    );
  });

  it('enqueues mode-stop and emits status', async () => {
    const websocketGateway = {
      emitBotStatus: jest.fn(),
    };

    const queueService = {
      enqueue: jest.fn().mockResolvedValue('job-2'),
    };

    const logger = {
      warn: jest.fn(),
    };

    const service = new BotService(websocketGateway as never, queueService as never, logger as never);

    const result = await service.stop('old-coins');

    expect(result).toEqual({ mode: 'old-coins', status: 'STOPPED' });
    expect(websocketGateway.emitBotStatus).toHaveBeenCalledWith({ mode: 'old-coins', status: 'STOPPED' });
    expect(queueService.enqueue).toHaveBeenCalledWith(
      'bot-mode',
      'mode-stop',
      expect.objectContaining({ mode: 'old-coins' }),
    );
  });
});
