import { IncidentStatus } from '@prisma/client';

import { IncidentService } from '../src/modules/itil/incident.service';

describe('IncidentService', () => {
  it('creates incident and emits signals', async () => {
    const created = {
      id: 'inc-1',
      severity: 'HIGH',
      category: 'RPC_ERROR',
      component: 'SolanaRpcService',
      description: 'RPC failed',
      status: IncidentStatus.OPEN,
    };

    const prisma = {
      incident: {
        create: jest.fn().mockResolvedValue(created),
      },
    };

    const websocketGateway = {
      emitIncidentCreated: jest.fn(),
      emitLog: jest.fn(),
    };

    const metricsService = {
      incidentCounter: {
        labels: jest.fn().mockReturnValue({ inc: jest.fn() }),
      },
    };

    const logger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    const service = new IncidentService(
      prisma as never,
      websocketGateway as never,
      metricsService as never,
      logger as never,
    );

    const incident = await service.createIncident({
      severity: 'HIGH',
      category: 'RPC_ERROR',
      component: 'SolanaRpcService',
      description: 'RPC failed',
      context: { endpoint: 'rpc1' },
    });

    expect(incident.id).toBe('inc-1');
    expect(prisma.incident.create).toHaveBeenCalledTimes(1);
    expect(websocketGateway.emitIncidentCreated).toHaveBeenCalledTimes(1);
    expect(websocketGateway.emitLog).toHaveBeenCalledTimes(1);
  });

  it('resolves incident', async () => {
    const prisma = {
      incident: {
        findUnique: jest.fn().mockResolvedValue({ id: 'inc-2' }),
        update: jest.fn().mockResolvedValue(undefined),
      },
    };

    const websocketGateway = {
      emitIncidentCreated: jest.fn(),
      emitLog: jest.fn(),
    };

    const metricsService = {
      incidentCounter: {
        labels: jest.fn().mockReturnValue({ inc: jest.fn() }),
      },
    };

    const logger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    const service = new IncidentService(
      prisma as never,
      websocketGateway as never,
      metricsService as never,
      logger as never,
    );

    await service.resolveIncident('inc-2', 'fixed');

    expect(prisma.incident.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'inc-2' },
      }),
    );
  });
});
