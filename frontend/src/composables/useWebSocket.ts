import { onMounted, onUnmounted } from 'vue';
import { io, type Socket } from 'socket.io-client';
import { useBotStore } from '@/stores/bot';
import { useLogsStore } from '@/stores/logs';
import { usePositionsStore } from '@/stores/positions';

let socket: Socket | null = null;

export const useWebSocket = () => {
  const botStore = useBotStore();
  const logsStore = useLogsStore();
  const positionsStore = usePositionsStore();

  onMounted(() => {
    if (socket) return;

    socket = io(import.meta.env.VITE_WS_URL ?? 'http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => logsStore.append('info', 'WebSocket conectado'));
    socket.on('disconnect', () => logsStore.append('warn', 'WebSocket desconectado'));

    socket.on('bot:status', (payload: { mode: 'smart-sniper' | 'old-coins' | 'traction'; status: 'RUNNING' | 'STOPPED' }) => {
      botStore.setModeStatus(payload.mode, payload.status);
    });

    socket.on('analysis:completed', (payload: { masterKPI: number }) => {
      botStore.registerKpi(payload.masterKPI);
    });

    socket.on('position:opened', positionsStore.upsertPosition);
    socket.on('position:updated', positionsStore.upsertPosition);
    socket.on('position:closed', positionsStore.upsertPosition);

    socket.on('incident:created', () => {
      botStore.activeIncidents += 1;
    });

    socket.on('log:info', (message: string) => logsStore.append('info', message));
    socket.on('log:warn', (message: string) => logsStore.append('warn', message));
    socket.on('log:error', (message: string) => logsStore.append('error', message));
  });

  onUnmounted(() => {
    socket?.disconnect();
    socket = null;
  });
};
