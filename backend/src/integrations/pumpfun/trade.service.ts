import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { LoggerService } from '../../utils/logger.util';
import { buildResilientHttpClient } from '../../utils/http-client.util';

type TradeAction = 'buy' | 'sell';
type TradePool = 'pump' | 'raydium' | 'auto';

export interface BuildTradeRequest {
  publicKey: string;
  action: TradeAction;
  mint: string;
  amount: number;
  denominatedInSol?: boolean;
  slippageBps?: number;
  priorityFeeSol?: number;
  pool?: TradePool;
}

@Injectable()
export class PumpfunTradeService {
  private readonly httpClient = buildResilientHttpClient(10_000);
  private readonly pumpPortalApiUrl = process.env.PUMPPORTAL_API_URL ?? 'https://pumpportal.fun/api';
  private readonly apiKey = process.env.PUMPPORTAL_API_KEY;

  constructor(private readonly logger: LoggerService) {}

  async buildTradeTransaction(request: BuildTradeRequest): Promise<string> {
    const payload = {
      publicKey: request.publicKey,
      action: request.action,
      mint: request.mint,
      amount: request.amount,
      denominatedInSol: request.denominatedInSol ?? true,
      slippage: request.slippageBps ?? 100,
      priorityFee: request.priorityFeeSol ?? 0.001,
      pool: request.pool ?? 'auto',
    };

    try {
      const response = await this.httpClient.post<string>(`${this.pumpPortalApiUrl}/trade-local`, payload, {
        headers: this.buildHeaders(),
      });
      return response.data;
    } catch (error) {
      this.logger.error('Failed to build PumpPortal trade transaction', {
        mint: request.mint,
        action: request.action,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
      throw new ServiceUnavailableException('PumpPortal trade endpoint unavailable');
    }
  }

  private buildHeaders(): Record<string, string> {
    if (!this.apiKey) {
      return { 'Content-Type': 'application/json' };
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'x-api-key': this.apiKey,
    };
  }
}
