<template>
  <div class="grid gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-4">
    <div class="rounded bg-slate-950 p-3">
      <p class="text-xs text-slate-400">Bot Status</p>
      <p class="text-sm font-semibold">{{ botStore.overallStatus }}</p>
    </div>
    <div class="rounded bg-slate-950 p-3">
      <p class="text-xs text-slate-400">Posições Ativas</p>
      <p class="text-sm font-semibold">{{ positionsStore.activeCount }}</p>
    </div>
    <div class="rounded bg-slate-950 p-3">
      <p class="text-xs text-slate-400">Incidentes Abertos</p>
      <p class="text-sm font-semibold">{{ botStore.activeIncidents }}</p>
    </div>
    <div class="rounded bg-slate-950 p-3">
      <p class="text-xs text-slate-400">PnL Não Realizado</p>
      <p class="text-sm font-semibold">{{ positionsStore.unrealizedPnLFormatted }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBotStore } from '@/stores/bot';
import { usePositionsStore } from '@/stores/positions';

const botStore = useBotStore();
const positionsStore = usePositionsStore();
</script>
