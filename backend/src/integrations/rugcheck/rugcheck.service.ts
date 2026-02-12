import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { RedisService } from '../../infrastructure/cache/redis.service';
import { LoggerService } from '../../utils/logger.util';
import { buildResilientHttpClient } from '../../utils/http-client.util';

type JsonRecord = Record<string, unknown>;

export interface RugcheckVerdict {
  tradable: boolean;
  score: number;
  rugged: boolean;
  reasons: string[];
}

@Injectable()
export class RugcheckService {
  private readonly httpClient = buildResilientHttpClient(8_000);
  private readonly baseUrl = process.env.RUGCHECK_API_URL ?? 'https://api.rugcheck.xyz/v1';
  private readonly apiKey = process.env.RUGCHECK_API_KEY;

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async getTokenReport(mint: string): Promise<JsonRecord> {
    const cacheKey = `rugcheck:report:${mint}`;
    return this.getFromCacheOrFetch(cacheKey, 90, async () => {
      try {
        const response = await this.httpClient.get<JsonRecord>(`${this.baseUrl}/tokens/${mint}/report`, {
          headers: this.buildHeaders(),
        });
        return response.data;
      } catch (error) {
        this.logger.warn('Failed to fetch RugCheck report', {
          mint,
          error: error instanceof Error ? error.message : 'unknown_error',
        });
        throw new ServiceUnavailableException('RugCheck endpoint unavailable');
      }
    });
  }

  async getVerdict(mint: string, minScore = 70): Promise<RugcheckVerdict> {
    const report = await this.getTokenReport(mint);
    const rugged = Boolean(report.rugged);

    const rawScore = typeof report.score_normalised === 'number' ? report.score_normalised : 0;
    const score = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

    const risks = Array.isArray(report.risks)
      ? report.risks
          .filter((risk) => typeof risk === 'string')
          .map((risk) => risk as string)
      : [];

    return {
      tradable: !rugged && score >= minScore,
      score,
      rugged,
      reasons: risks,
    };
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
        this.logger.warn('Failed to parse cached RugCheck payload', { cacheKey });
      }
    }

    const value = await fetcher();
    await redis.set(cacheKey, JSON.stringify(value), 'EX', ttlSeconds);
    return value;
  }
}
