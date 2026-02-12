import { Injectable } from '@nestjs/common';

import { SolanaRpcService } from './rpc.service';

@Injectable()
export class SolanaTransactionService {
  constructor(private readonly rpcService: SolanaRpcService) {}

  async getCurrentSlot(): Promise<number> {
    return this.rpcService.executeWithFailover(async (connection) => connection.getSlot());
  }
}
