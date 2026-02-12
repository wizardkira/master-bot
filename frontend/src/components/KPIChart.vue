<template>
  <article class="rounded border border-slate-800 bg-slate-900/60 p-4">
    <header class="mb-3">
      <h3 class="font-semibold">KPI Médio (Últimas análises)</h3>
    </header>
    <apexchart type="line" height="280" :options="chartOptions" :series="series" />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBotStore } from '@/stores/bot';

const botStore = useBotStore();

const series = computed(() => [
  {
    name: 'Master KPI',
    data: botStore.kpiHistory.map((kpi) => kpi.value),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    background: 'transparent',
  },
  xaxis: {
    categories: botStore.kpiHistory.map((kpi) => kpi.label),
    labels: { style: { colors: '#94a3b8' } },
  },
  yaxis: {
    min: 0,
    max: 100,
    labels: { style: { colors: '#94a3b8' } },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  colors: ['#10b981'],
  grid: {
    borderColor: '#334155',
  },
  theme: {
    mode: 'dark',
  },
}));
</script>
