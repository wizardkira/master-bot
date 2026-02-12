export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  factor: number;
}

export class RetryManager {
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions,
    onRetry?: (attempt: number, delayMs: number, error: unknown) => void,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= options.maxRetries; attempt += 1) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt === options.maxRetries) {
          break;
        }

        const delayMs = Math.min(
          options.initialDelayMs * Math.pow(options.factor, attempt),
          options.maxDelayMs,
        );

        onRetry?.(attempt + 1, delayMs, error);
        await this.sleep(delayMs);
      }
    }

    throw lastError;
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
