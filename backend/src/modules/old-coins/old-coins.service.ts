import { Injectable } from '@nestjs/common';

@Injectable()
export class OldCoinsService {
  getStatus(): { mode: string; status: string } {
    return { mode: 'old-coins', status: 'NOT_IMPLEMENTED' };
  }
}
