import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

type BotMode = 'smart-sniper' | 'old-coins' | 'traction';
type ModeStatus = 'STOPPED' | 'RUNNING';

interface KpiPoint {
  label: string;
  value: number;
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

export const useBotStore = defineStore('bot', () => {
  const smartSniperStatus = ref<ModeStatus>('STOPPED');
  const oldCoinsStatus = ref<ModeStatus>('STOPPED');
  const tractionStatus = ref<ModeStatus>('STOPPED');
  const activeIncidents = ref(0);
  const kpiHistory = ref<KpiPoint[]>([]);

  const overallStatus = computed(() => {
    const isRunning = [smartSniperStatus.value, oldCoinsStatus.value, tractionStatus.value].includes('RUNNING');
    return isRunning ? 'RUNNING' : 'STOPPED';
  });

  const startMode = async (mode: BotMode) => {
    await http.post(`/api/bot/${mode}/start`);
    setModeStatus(mode, 'RUNNING');
  };

  const stopMode = async (mode: BotMode) => {
    await http.post(`/api/bot/${mode}/stop`);
    setModeStatus(mode, 'STOPPED');
  };

  const setModeStatus = (mode: BotMode, status: ModeStatus) => {
    if (mode === 'smart-sniper') smartSniperStatus.value = status;
    if (mode === 'old-coins') oldCoinsStatus.value = status;
    if (mode === 'traction') tractionStatus.value = status;
  };

  const registerKpi = (value: number) => {
    const label = new Date().toLocaleTimeString();
    kpiHistory.value = [...kpiHistory.value, { label, value }].slice(-20);
  };

  return {
    smartSniperStatus,
    oldCoinsStatus,
    tractionStatus,
    activeIncidents,
    kpiHistory,
    overallStatus,
    startMode,
    stopMode,
    setModeStatus,
    registerKpi,
  };
});
