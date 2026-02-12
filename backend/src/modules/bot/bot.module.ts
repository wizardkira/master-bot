import { Module } from '@nestjs/common';

import { WebsocketModule } from '../websocket/websocket.module';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  imports: [WebsocketModule],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
