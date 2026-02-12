import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, ConnectionConfig } from '@solana/web3.js';

import { MetricsService } from '../../observability/metrics.service';
import { LoggerService } from '../../utils/logger.util';
import { IncidentService } from '../../modules/itil/incident.service';

@Injectable()
export class SolanaRpcService {
  private readonly connections: Connection[];
  private currentIndex = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly incidentService: IncidentService,
    private readonly logger: LoggerService,
    private readonly metricsService: MetricsService,
  ) {
    const commitmentConfig: ConnectionConfig = {
      commitment: 'confirmed',
      disableRetryOnRateLimit: false,
      confirmTransactionInitialTimeout: 30_000,
    };

    const rpcs = [
      this.configService.get<string>('solana.rpcPrimary', { infer: true }),
      this.configService.get<string>('solana.rpcSecondary', { infer: true }),
      this.configService.get<string>('solana.rpcTertiary', { infer: true }),
    ].filter((value): value is string => Boolean(value));

    this.connections = rpcs.map((rpc) => new Connection(rpc, commitmentConfig));
  }

  getCurrentConnection(): Connection {
    return this.connections[this.currentIndex];
  }

  async executeWithFailover<T>(operation: (connection: Connection) => Promise<T>): Promise<T> {
    if (!this.connections.length) {
      throw new Error('No RPC endpoints configured');
    }

    let lastError: unknown;

    for (let attempt = 0; attempt < this.connections.length; attempt += 1) {
      const index = (this.currentIndex + attempt) % this.connections.length;
      const connection = this.connections[index];

      try {
        const result = await operation(connection);
        if (index !== this.currentIndex) {
          const previous = this.currentIndex;
          this.currentIndex = index;
          this.metricsService.rpcFailoverCounter
            .labels(previous.toString(), index.toString())
            .inc();
        }
        return result;
      } catch (error) {
        lastError = error;

        await this.incidentService.createIncident({
          severity: 'HIGH',
          category: 'RPC_ERROR',
          component: 'SolanaRpcService',
          description: `RPC failover attempt ${attempt + 1} failed`,
          errorMessage: error instanceof Error ? error.message : 'Unknown RPC error',
          stack: error instanceof Error ? error.stack : undefined,
          context: {
            endpointIndex: index,
            attempt,
          },
        });

        this.logger.warn('RPC endpoint failed, trying next endpoint', {
          endpointIndex: index,
          attempt,
        });
      }
    }

    throw lastError;
  }
}
