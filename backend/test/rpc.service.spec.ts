import { SolanaRpcService } from '../src/integrations/solana/rpc.service';

describe('SolanaRpcService', () => {
  it('fails over to next RPC endpoint when first attempt fails', async () => {
    const configService = {
      get: (key: string) => {
        if (key === 'solana.rpcPrimary') return 'https://rpc1.example.com';
        if (key === 'solana.rpcSecondary') return 'https://rpc2.example.com';
        if (key === 'solana.rpcTertiary') return 'https://rpc3.example.com';
        return undefined;
      },
    };

    const incidentService = {
      createIncident: jest.fn().mockResolvedValue(undefined),
    };

    const logger = {
      warn: jest.fn(),
    };

    const labels = jest.fn().mockReturnValue({ inc: jest.fn() });
    const metricsService = {
      rpcFailoverCounter: { labels },
    };

    const rpcService = new SolanaRpcService(
      configService as never,
      incidentService as never,
      logger as never,
      metricsService as never,
    );

    let attempt = 0;
    const value = await rpcService.executeWithFailover(async () => {
      attempt += 1;
      if (attempt === 1) {
        throw new Error('rpc down');
      }
      return 42;
    });

    expect(value).toBe(42);
    expect(incidentService.createIncident).toHaveBeenCalledTimes(1);
    expect(labels).toHaveBeenCalledTimes(1);
  });
});
