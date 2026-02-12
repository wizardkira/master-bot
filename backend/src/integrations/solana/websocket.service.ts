import { Injectable } from '@nestjs/common';

@Injectable()
export class SolanaWebsocketService {
  private connected = false;

  connect(): void {
    this.connected = true;
  }

  disconnect(): void {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
