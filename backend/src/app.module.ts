import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import appConfig from './config/app.config';
import solanaConfig from './config/solana.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { CacheModule } from './infrastructure/cache/cache.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { BullModule } from './infrastructure/queue/bull.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { SolanaModule } from './integrations/solana/solana.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BotModule } from './modules/bot/bot.module';
import { ItilModule } from './modules/itil/itil.module';
import { PositionsModule } from './modules/positions/positions.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { MetricsController } from './observability/metrics.controller';
import { ObservabilityModule } from './observability/observability.module';
import { LoggingModule } from './utils/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, solanaConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        RPC_URL_PRIMARY: Joi.string().required(),
        RPC_URL_SECONDARY: Joi.string().required(),
        RPC_URL_TERTIARY: Joi.string().required(),
        LOG_LEVEL: Joi.string().default('info'),
        PROMETHEUS_PORT: Joi.number().default(9090),
        PUMPPORTAL_API_URL: Joi.string().uri().default('https://pumpportal.fun/api'),
        PUMPFUN_SWAP_API_URL: Joi.string().uri().default('https://swap-api.pump.fun'),
        PUMPFUN_FRONTEND_API_URL: Joi.string().uri().default('https://frontend-api-v3.pump.fun'),
        RUGCHECK_API_URL: Joi.string().uri().default('https://api.rugcheck.xyz/v1'),
        INSIGHTX_API_URL: Joi.string().uri().default('https://app.insightx.network/api/portal'),
        JUPITER_API_URL: Joi.string().uri().default('https://api.jup.ag'),
        PUMPPORTAL_API_KEY: Joi.string().allow('').optional(),
        RUGCHECK_API_KEY: Joi.string().allow('').optional(),
        INSIGHTX_API_KEY: Joi.string().allow('').optional(),
      }),
    }),
    DatabaseModule,
    CacheModule,
    BullModule,
    LoggingModule,
    ObservabilityModule,
    WebsocketModule,
    SolanaModule,
    IntegrationsModule,
    ItilModule,
    BotModule,
    PositionsModule,
    AnalyticsModule,
  ],
  controllers: [MetricsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    RequestLoggingInterceptor,
    AllExceptionsFilter,
  ],
})
export class AppModule {}
