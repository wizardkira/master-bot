import { Global, Module } from '@nestjs/common';

import { appLoggerProviders, LoggerService } from './logger.util';

@Global()
@Module({
  providers: [...appLoggerProviders, LoggerService],
  exports: [...appLoggerProviders, LoggerService],
})
export class LoggingModule {}
