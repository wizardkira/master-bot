import { Module } from '@nestjs/common';

import { ItilModule } from '../../modules/itil/itil.module';
import { SolanaRpcService } from './rpc.service';
import { SolanaTransactionService } from './transaction.service';
import { SolanaWebsocketService } from './websocket.service';

@Module({
  imports: [ItilModule],
  providers: [SolanaRpcService, SolanaWebsocketService, SolanaTransactionService],
  exports: [SolanaRpcService, SolanaWebsocketService, SolanaTransactionService],
})
export class SolanaModule {}
