<template>
  <article class="rounded border border-slate-800 bg-slate-900/60 p-4">
    <header class="mb-3 flex items-center justify-between">
      <h3 class="font-semibold">Old Coins</h3>
      <span class="text-xs" :class="statusClass">{{ status }}</span>
    </header>
    <p class="mb-4 text-sm text-slate-400">Detecta moedas antigas com retomada de tração.</p>
    <div class="flex gap-2">
      <button class="rounded bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500" @click="start">Start</button>
      <button class="rounded bg-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-500" @click="stop">Stop</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBotStore } from '@/stores/bot';

const botStore = useBotStore();
const status = computed(() => botStore.oldCoinsStatus);
const statusClass = computed(() => (status.value === 'RUNNING' ? 'text-emerald-400' : 'text-rose-400'));

const start = async () => botStore.startMode('old-coins');
const stop = async () => botStore.stopMode('old-coins');
</script>
