import { Controller, Get, Param, Post } from '@nestjs/common';

import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post(':mode/start')
  async start(@Param('mode') mode: 'smart-sniper' | 'old-coins' | 'traction') {
    return this.botService.start(mode);
  }

  @Post(':mode/stop')
  async stop(@Param('mode') mode: 'smart-sniper' | 'old-coins' | 'traction') {
    return this.botService.stop(mode);
  }

  @Get(':mode/status')
  status(@Param('mode') mode: 'smart-sniper' | 'old-coins' | 'traction') {
    return this.botService.status(mode);
  }
}
