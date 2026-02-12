import { Module } from '@nestjs/common';

import { InsightxService } from './insightx/insightx.service';
import { JupiterService } from './jupiter/jupiter.service';
import { PumpfunApiService } from './pumpfun/api.service';
import { PumpfunTradeService } from './pumpfun/trade.service';
import { RugcheckService } from './rugcheck/rugcheck.service';

@Module({
  providers: [PumpfunApiService, PumpfunTradeService, RugcheckService, InsightxService, JupiterService],
  exports: [PumpfunApiService, PumpfunTradeService, RugcheckService, InsightxService, JupiterService],
})
export class IntegrationsModule {}
