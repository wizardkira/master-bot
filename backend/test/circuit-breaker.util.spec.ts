import { CircuitBreaker } from '../src/utils/circuit-breaker.util';

describe('CircuitBreaker', () => {
  it('opens after threshold and blocks calls', async () => {
    const breaker = new CircuitBreaker({
      failureThreshold: 2,
      resetTimeoutMs: 10_000,
    });

    await expect(breaker.execute(async () => {
      throw new Error('failure 1');
    })).rejects.toThrow('failure 1');

    await expect(breaker.execute(async () => {
      throw new Error('failure 2');
    })).rejects.toThrow('failure 2');

    expect(breaker.getState()).toBe('OPEN');

    await expect(breaker.execute(async () => 'ok')).rejects.toThrow('Circuit breaker is OPEN');
  });

  it('moves to half-open and closes on successful probe', async () => {
    const breaker = new CircuitBreaker({
      failureThreshold: 1,
      resetTimeoutMs: 0,
    });

    await expect(breaker.execute(async () => {
      throw new Error('failure');
    })).rejects.toThrow('failure');

    expect(breaker.getState()).toBe('OPEN');

    const result = await breaker.execute(async () => 'recovered');

    expect(result).toBe('recovered');
    expect(breaker.getState()).toBe('CLOSED');
  });
});
