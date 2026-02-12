import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { RedisService } from '../../infrastructure/cache/redis.service';
import { LoggerService } from '../../utils/logger.util';
import { buildResilientHttpClient } from '../../utils/http-client.util';

type JsonRecord = Record<string, unknown>;

export interface JupiterQuoteRequest {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps?: number;
}

@Injectable()
export class JupiterService {
  private readonly httpClient = buildResilientHttpClient(8_000);
  private readonly baseUrl = process.env.JUPITER_API_URL ?? 'https://api.jup.ag';

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async getPrice(ids: string[]): Promise<JsonRecord> {
    const normalizedIds = ids.filter(Boolean).sort();
    const cacheKey = `jupiter:price:${normalizedIds.join(',')}`;

    return this.getFromCacheOrFetch(cacheKey, 12, async () => {
      try {
        const response = await this.httpClient.get<JsonRecord>(`${this.baseUrl}/price/v2`, {
          params: { ids: normalizedIds.join(',') },
        });
        return response.data;
      } catch (error) {
        this.logger.warn('Failed to fetch Jupiter prices', {
          ids: normalizedIds,
          error: error instanceof Error ? error.message : 'unknown_error',
        });
        throw new ServiceUnavailableException('Jupiter price endpoint unavailable');
      }
    });
  }

  async getQuote(request: JupiterQuoteRequest): Promise<JsonRecord> {
    const slippageBps = request.slippageBps ?? 100;
    const cacheKey = `jupiter:quote:${request.inputMint}:${request.outputMint}:${request.amount}:${slippageBps}`;

    return this.getFromCacheOrFetch(cacheKey, 8, async () => {
      try {
        const response = await this.httpClient.get<JsonRecord>(`${this.baseUrl}/swap/v1/quote`, {
          params: {
            inputMint: request.inputMint,
            outputMint: request.outputMint,
            amount: request.amount,
            slippageBps,
          },
        });
        return response.data;
      } catch (error) {
        this.logger.warn('Failed to fetch Jupiter quote', {
          inputMint: request.inputMint,
          outputMint: request.outputMint,
          error: error instanceof Error ? error.message : 'unknown_error',
        });
        throw new ServiceUnavailableException('Jupiter quote endpoint unavailable');
      }
    });
  }

  async buildSwapTransaction(userPublicKey: string, quoteResponse: JsonRecord): Promise<JsonRecord> {
    try {
      const response = await this.httpClient.post<JsonRecord>(`${this.baseUrl}/swap/v1/swap`, {
        userPublicKey,
        quoteResponse,
      });
      return response.data;
    } catch (error) {
      this.logger.error('Failed to build Jupiter swap transaction', {
        userPublicKey,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
      throw new ServiceUnavailableException('Jupiter swap endpoint unavailable');
    }
  }

  private async getFromCacheOrFetch<T>(cacheKey: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const redis = this.redisService.getClient();
    const cachedValue = await redis.get(cacheKey);

    if (cachedValue) {
      try {
        return JSON.parse(cachedValue) as T;
      } catch {
        this.logger.warn('Failed to parse cached Jupiter payload', { cacheKey });
      }
    }

    const value = await fetcher();
    await redis.set(cacheKey, JSON.stringify(value), 'EX', ttlSeconds);
    return value;
  }
}
