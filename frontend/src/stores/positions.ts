import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export interface PositionRow {
  id: string;
  mint: string;
  kpi: number;
  status: 'ACTIVE' | 'PARTIAL_EXIT' | 'CLOSED';
  unrealizedPnLPercent: number;
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

export const usePositionsStore = defineStore('positions', () => {
  const positions = ref<PositionRow[]>([]);
  const activeCount = computed(() => positions.value.filter((p) => p.status !== 'CLOSED').length);
  const unrealizedPnLFormatted = computed(() => {
    const value = positions.value.reduce((sum, p) => sum + p.unrealizedPnLPercent, 0);
    return `${value.toFixed(2)}%`;
  });

  const fetchPositions = async () => {
    const { data } = await http.get<PositionRow[]>('/api/positions');
    positions.value = data;
  };

  const upsertPosition = (next: PositionRow) => {
    const index = positions.value.findIndex((p) => p.id === next.id);
    if (index === -1) {
      positions.value.unshift(next);
      return;
    }
    positions.value[index] = next;
  };

  return {
    positions,
    activeCount,
    unrealizedPnLFormatted,
    fetchPositions,
    upsertPosition,
  };
});
