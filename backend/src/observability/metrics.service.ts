import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  readonly httpRequestDuration = new Histogram({
    name: 'master_bot_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    registers: [this.registry],
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  });

  readonly incidentCounter = new Counter({
    name: 'master_bot_incidents_total',
    help: 'Total incidents created',
    labelNames: ['severity', 'category'],
    registers: [this.registry],
  });

  readonly rpcFailoverCounter = new Counter({
    name: 'master_bot_rpc_failovers_total',
    help: 'Total Solana RPC failover attempts',
    labelNames: ['from', 'to'],
    registers: [this.registry],
  });

  constructor() {
    collectDefaultMetrics({ register: this.registry, prefix: 'master_bot_' });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
