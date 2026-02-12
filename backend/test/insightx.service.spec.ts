import { InsightxService } from '../src/integrations/insightx/insightx.service';

describe('InsightxService', () => {
  it('returns HIGH risk for dense bubblemap graph', async () => {
    const service = new InsightxService({ getClient: jest.fn() } as never, { warn: jest.fn() } as never);

    jest.spyOn(service, 'getBubblemap').mockResolvedValue({
      links: new Array(40).fill({}),
      clusters: new Array(25).fill({}),
    });

    const risk = await service.evaluateHolderRisk('mint');

    expect(risk).toEqual({
      suspiciousConnections: 65,
      riskLevel: 'HIGH',
    });
  });

  it('returns LOW risk when few connections are present', async () => {
    const service = new InsightxService({ getClient: jest.fn() } as never, { warn: jest.fn() } as never);

    jest.spyOn(service, 'getBubblemap').mockResolvedValue({
      links: new Array(10).fill({}),
      clusters: new Array(5).fill({}),
    });

    const risk = await service.evaluateHolderRisk('mint');

    expect(risk).toEqual({
      suspiciousConnections: 15,
      riskLevel: 'LOW',
    });
  });
});
