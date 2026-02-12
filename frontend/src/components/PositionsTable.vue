<template>
  <article class="rounded border border-slate-800 bg-slate-900/60 p-4">
    <header class="mb-3 flex items-center justify-between">
      <h3 class="font-semibold">Posições</h3>
      <button class="rounded bg-slate-800 px-2 py-1 text-xs hover:bg-slate-700" @click="positionsStore.fetchPositions">Atualizar</button>
    </header>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-slate-400">
          <tr>
            <th class="pb-2">Mint</th>
            <th class="pb-2">KPI</th>
            <th class="pb-2">Status</th>
            <th class="pb-2">PnL%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="position in positionsStore.positions" :key="position.id" class="border-t border-slate-800">
            <td class="py-2">{{ position.mint.slice(0, 6) }}...{{ position.mint.slice(-4) }}</td>
            <td class="py-2">{{ position.kpi.toFixed(1) }}</td>
            <td class="py-2">{{ position.status }}</td>
            <td class="py-2" :class="position.unrealizedPnLPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'">
              {{ position.unrealizedPnLPercent.toFixed(2) }}%
            </td>
          </tr>
          <tr v-if="!positionsStore.positions.length">
            <td colspan="4" class="py-4 text-center text-slate-500">Sem posições.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePositionsStore } from '@/stores/positions';

const positionsStore = usePositionsStore();

onMounted(() => {
  void positionsStore.fetchPositions();
});
</script>
