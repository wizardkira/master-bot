import { RetryManager } from '../src/utils/retry.util';

describe('RetryManager', () => {
  it('retries until success', async () => {
    const retryManager = new RetryManager();
    let attempts = 0;

    const result = await retryManager.executeWithRetry(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          throw new Error('temporary error');
        }
        return 'ok';
      },
      {
        maxRetries: 3,
        initialDelayMs: 1,
        maxDelayMs: 2,
        factor: 2,
      },
    );

    expect(result).toBe('ok');
    expect(attempts).toBe(3);
  });

  it('throws after max retries', async () => {
    const retryManager = new RetryManager();

    await expect(
      retryManager.executeWithRetry(
        async () => {
          throw new Error('always fails');
        },
        {
          maxRetries: 2,
          initialDelayMs: 1,
          maxDelayMs: 1,
          factor: 2,
        },
      ),
    ).rejects.toThrow('always fails');
  });
});
