import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { RedisService } from '../../infrastructure/cache/redis.service';
import { LoggerService } from '../../utils/logger.util';
import { buildResilientHttpClient } from '../../utils/http-client.util';

type JsonRecord = Record<string, unknown>;

export interface InsightxHolderRisk {
  suspiciousConnections: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

@Injectable()
export class InsightxService {
  private readonly httpClient = buildResilientHttpClient(8_000);
  private readonly baseUrl = process.env.INSIGHTX_API_URL ?? 'https://app.insightx.network/api/portal';
  private readonly apiKey = process.env.INSIGHTX_API_KEY;

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async getBubblemap(mint: string): Promise<JsonRecord> {
    const cacheKey = `insightx:bubblemap:${mint}`;

    return this.getFromCacheOrFetch(cacheKey, 120, async () => {
      try {
        const response = await this.httpClient.get<JsonRecord>(`${this.baseUrl}/bubblemap/getBubblemap`, {
          params: {
            chain: 'solana',
            tokenAddress: mint,
          },
          headers: this.buildHeaders(),
        });
        return response.data;
      } catch (error) {
        this.logger.warn('Failed to fetch InsightX bubblemap', {
          mint,
          error: error instanceof Error ? error.message : 'unknown_error',
        });
        throw new ServiceUnavailableException('InsightX endpoint unavailable');
      }
    });
  }

  async evaluateHolderRisk(mint: string): Promise<InsightxHolderRisk> {
    const bubblemap = await this.getBubblemap(mint);

    const links = Array.isArray(bubblemap.links) ? bubblemap.links.length : 0;
    const clusters = Array.isArray(bubblemap.clusters) ? bubblemap.clusters.length : 0;
    const suspiciousConnections = links + clusters;

    if (suspiciousConnections >= 60) {
      return { suspiciousConnections, riskLevel: 'HIGH' };
    }

    if (suspiciousConnections >= 25) {
      return { suspiciousConnections, riskLevel: 'MEDIUM' };
    }

    return { suspiciousConnections, riskLevel: 'LOW' };
  }

  private buildHeaders(): Record<string, string> {
    if (!this.apiKey) {
      return {};
    }

    return {
      Authorization: `Bearer ${this.apiKey}`,
      'x-api-key': this.apiKey,
    };
  }

  private async getFromCacheOrFetch<T>(cacheKey: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const redis = this.redisService.getClient();
    const cachedValue = await redis.get(cacheKey);

    if (cachedValue) {
      try {
        return JSON.parse(cachedValue) as T;
      } catch {
        this.logger.warn('Failed to parse cached InsightX payload', { cacheKey });
      }
    }

    const value = await fetcher();
    await redis.set(cacheKey, JSON.stringify(value), 'EX', ttlSeconds);
    return value;
  }
}
