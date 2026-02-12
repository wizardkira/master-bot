import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import * as winston from 'winston';

import { MetricsService } from '../../observability/metrics.service';
import { LOGGER } from '../../utils/logger.util';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER) private readonly logger: winston.Logger,
    private readonly metricsService: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { ip?: string }>();
    const response = http.getResponse<{ statusCode: number }>();

    const start = process.hrtime.bigint();

    return next.handle().pipe(
      tap(() => {
        const durationNs = Number(process.hrtime.bigint() - start);
        const durationSec = durationNs / 1_000_000_000;
        const route = request.url;
        const statusCode = response.statusCode;

        this.metricsService.httpRequestDuration
          .labels(request.method, route, statusCode.toString())
          .observe(durationSec);

        this.logger.info('HTTP request', {
          method: request.method,
          route,
          statusCode,
          durationSec,
          ip: request.ip,
        });
      }),
    );
  }
}
