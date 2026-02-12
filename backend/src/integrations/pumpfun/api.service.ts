import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { RedisService } from '../../infrastructure/cache/redis.service';
import { LoggerService } from '../../utils/logger.util';
import { buildResilientHttpClient } from '../../utils/http-client.util';

type JsonRecord = Record<string, unknown>;

@Injectable()
export class PumpfunApiService {
  private readonly httpClient = buildResilientHttpClient(10_000);
  private readonly swapApiBaseUrl = process.env.PUMPFUN_SWAP_API_URL ?? 'https://swap-api.pump.fun';
  private readonly frontendApiBaseUrl =
    process.env.PUMPFUN_FRONTEND_API_URL ?? 'https://frontend-api-v3.pump.fun';

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async getCoin(mint: string): Promise<JsonRecord> {
    const cacheKey = `pumpfun:coin:${mint}`;
    return this.getFromCacheOrFetch(cacheKey, 45, async () => {
      try {
        const response = await this.httpClient.get<JsonRecord>(`${this.frontendApiBaseUrl}/coins/${mint}`);
        return response.data;
      } catch (error) {
        this.logger.warn('Failed to fetch PumpFun coin', {
          mint,
          error: error instanceof Error ? error.message : 'unknown_error',
        });
        throw new ServiceUnavailableException('PumpFun coin endpoint unavailable');
      }
    });
  }

  async getMarketActivity(mint: string): Promise<JsonRecord> {
    const cacheKey = `pumpfun:market-activity:${mint}`;
    return this.getFromCacheOrFetch(cacheKey, 20, async () => {
      try {
        const response = await this.httpClient.get<JsonRecord>(
          `${this.swapApiBaseUrl}/v1/coins/${mint}/market-activity`,
          {
            params: { program: 'pump' },
          },
        );
        return response.data;
      } catch (error) {
        this.logger.warn('Failed to fetch PumpFun market activity', {
          mint,
          error: error instanceof Error ? error.message : 'unknown_error',
        });
        throw new ServiceUnavailableException('PumpFun market activity endpoint unavailable');
      }
    });
  }

  async getCurrentlyLive(limit = 20): Promise<JsonRecord[]> {
    const normalizedLimit = Math.max(1, Math.min(limit, 100));
    const cacheKey = `pumpfun:currently-live:${normalizedLimit}`;

    return this.getFromCacheOrFetch(cacheKey, 15, async () => {
      try {
        const response = await this.httpClient.get<JsonRecord[]>(`${this.frontendApiBaseUrl}/coins/currently-live`, {
          params: {
            offset: 0,
            limit: normalizedLimit,
          },
        });
        return response.data;
      } catch (error) {
        this.logger.warn('Failed to fetch PumpFun currently-live list', {
          limit: normalizedLimit,
          error: error instanceof Error ? error.message : 'unknown_error',
        });
        throw new ServiceUnavailableException('PumpFun listing endpoint unavailable');
      }
    });
  }

  private async getFromCacheOrFetch<T>(cacheKey: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const redis = this.redisService.getClient();
    const cachedValue = await redis.get(cacheKey);

    if (cachedValue) {
      try {
        return JSON.parse(cachedValue) as T;
      } catch {
        this.logger.warn('Failed to parse cached PumpFun payload', { cacheKey });
      }
    }

    const value = await fetcher();
    await redis.set(cacheKey, JSON.stringify(value), 'EX', ttlSeconds);
    return value;
  }
}
