<template>
  <article class="rounded border border-slate-800 bg-slate-900/60 p-4">
    <header class="mb-3 flex items-center justify-between">
      <h3 class="font-semibold">Traction Monitor</h3>
      <span class="text-xs" :class="statusClass">{{ status }}</span>
    </header>
    <p class="mb-4 text-sm text-slate-400">Entrada rápida em tokens com tração validada por fresh wallets.</p>
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
const status = computed(() => botStore.tractionStatus);
const statusClass = computed(() => (status.value === 'RUNNING' ? 'text-emerald-400' : 'text-rose-400'));

const start = async () => botStore.startMode('traction');
const stop = async () => botStore.stopMode('traction');
</script>
