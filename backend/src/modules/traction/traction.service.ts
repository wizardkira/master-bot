import { Injectable } from '@nestjs/common';

@Injectable()
export class TractionService {
  getStatus(): { mode: string; status: string } {
    return { mode: 'traction', status: 'NOT_IMPLEMENTED' };
  }
}
