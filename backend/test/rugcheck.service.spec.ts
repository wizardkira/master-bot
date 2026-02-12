import { RugcheckService } from '../src/integrations/rugcheck/rugcheck.service';

describe('RugcheckService', () => {
  it('marks token as tradable when score passes threshold and not rugged', async () => {
    const service = new RugcheckService({ getClient: jest.fn() } as never, { warn: jest.fn() } as never);

    jest.spyOn(service, 'getTokenReport').mockResolvedValue({
      score_normalised: 0.82,
      rugged: false,
      risks: ['holder concentration'],
    });

    const verdict = await service.getVerdict('mint', 70);

    expect(verdict).toEqual({
      tradable: true,
      score: 82,
      rugged: false,
      reasons: ['holder concentration'],
    });
  });

  it('marks token as non-tradable when rugged', async () => {
    const service = new RugcheckService({ getClient: jest.fn() } as never, { warn: jest.fn() } as never);

    jest.spyOn(service, 'getTokenReport').mockResolvedValue({
      score_normalised: 95,
      rugged: true,
      risks: ['mint authority active'],
    });

    const verdict = await service.getVerdict('mint', 70);

    expect(verdict.tradable).toBe(false);
    expect(verdict.score).toBe(95);
    expect(verdict.rugged).toBe(true);
  });
});
