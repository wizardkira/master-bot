import { Module } from '@nestjs/common';

import { TractionService } from './traction.service';

@Module({
  providers: [TractionService],
  exports: [TractionService],
})
export class TractionModule {}
