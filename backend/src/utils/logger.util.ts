import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

export const LOGGER = Symbol('LOGGER');

const buildLogger = (level: string): winston.Logger =>
  winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    transports: [new winston.transports.Console()],
  });

export const appLoggerProviders = [
  {
    provide: LOGGER,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): winston.Logger => {
      const level = configService.get<string>('app.logLevel', { infer: true }) ?? 'info';
      return buildLogger(level);
    },
  },
];

@Injectable()
export class LoggerService {
  constructor(@Inject(LOGGER) private readonly logger: winston.Logger) {}

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }
}
