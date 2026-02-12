import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    client.emit('log:info', 'Connected to Master Bot gateway');
  }

  handleDisconnect(client: Socket): void {
    client.emit('log:warn', 'Disconnected from Master Bot gateway');
  }

  emitBotStatus(payload: { mode: string; status: 'RUNNING' | 'STOPPED' }): void {
    this.server.emit('bot:status', payload);
  }

  emitPositionEvent(event: 'position:opened' | 'position:updated' | 'position:closed', payload: unknown): void {
    this.server.emit(event, payload);
  }

  emitAnalysisCompleted(payload: { masterKPI: number; mint?: string }): void {
    this.server.emit('analysis:completed', payload);
  }

  emitAnalysisRejected(payload: { mint: string; reasons: string[] }): void {
    this.server.emit('analysis:rejected', payload);
  }

  emitIncidentCreated(payload: unknown): void {
    this.server.emit('incident:created', payload);
  }

  emitLog(level: 'info' | 'warn' | 'error', message: string): void {
    this.server.emit(`log:${level}`, message);
  }

  @SubscribeMessage('bot:start')
  handleBotStart(@MessageBody() payload: { mode: string }): { ok: boolean } {
    this.emitLog('info', `Socket bot:start received for ${payload.mode}`);
    return { ok: true };
  }

  @SubscribeMessage('bot:stop')
  handleBotStop(@MessageBody() payload: { mode: string }): { ok: boolean } {
    this.emitLog('info', `Socket bot:stop received for ${payload.mode}`);
    return { ok: true };
  }

  @SubscribeMessage('position:close')
  handlePositionClose(
    @MessageBody() payload: { positionId: string },
    @ConnectedSocket() client: Socket,
  ): { ok: boolean } {
    client.emit('log:info', `Socket position:close received for ${payload.positionId}`);
    return { ok: true };
  }
}
