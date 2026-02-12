import { Module } from '@nestjs/common';

import { SmartSniperService } from './smart-sniper.service';

@Module({
  providers: [SmartSniperService],
  exports: [SmartSniperService],
})
export class SmartSniperModule {}
