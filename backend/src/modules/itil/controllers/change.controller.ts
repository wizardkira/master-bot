import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChangeStatus } from '@prisma/client';

import { ChangeService } from '../change.service';
import { CreateChangeDto } from '../dto/create-change.dto';

@Controller('changes')
export class ChangeController {
  constructor(private readonly changeService: ChangeService) {}

  @Get()
  async listChanges() {
    return this.changeService.list();
  }

  @Post()
  async createChange(@Body() payload: CreateChangeDto) {
    return this.changeService.create(payload);
  }

  @Post(':id/status/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: ChangeStatus,
  ) {
    return this.changeService.updateStatus(id, status);
  }
}
