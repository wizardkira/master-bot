import { Injectable } from '@nestjs/common';

@Injectable()
export class SmartSniperService {
  getStatus(): { mode: string; status: string } {
    return { mode: 'smart-sniper', status: 'NOT_IMPLEMENTED' };
  }
}
