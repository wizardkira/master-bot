import { Module } from '@nestjs/common';

import { OldCoinsService } from './old-coins.service';

@Module({
  providers: [OldCoinsService],
  exports: [OldCoinsService],
})
export class OldCoinsModule {}
