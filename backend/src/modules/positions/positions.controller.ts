import { Controller, Get, Param, Post } from '@nestjs/common';

import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async getPositions() {
    return this.positionsService.getAll();
  }

  @Get(':id')
  async getPosition(@Param('id') id: string) {
    return this.positionsService.getById(id);
  }

  @Post(':id/close')
  async closePosition(@Param('id') id: string) {
    return this.positionsService.closePosition(id);
  }
}
