import { Controller, Get } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('performance')
  async getPerformance() {
    return this.analyticsService.getPerformance();
  }

  @Get('pnl')
  async getPnl() {
    return this.analyticsService.getPnL();
  }
}
