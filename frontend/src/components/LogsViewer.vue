<template>
  <article class="rounded border border-slate-800 bg-slate-900/60 p-4">
    <header class="mb-3 flex items-center justify-between">
      <h3 class="font-semibold">Logs</h3>
      <span class="text-xs text-slate-400">{{ logsStore.logs.length }} eventos</span>
    </header>
    <div class="max-h-64 space-y-2 overflow-auto rounded bg-slate-950 p-3 text-xs">
      <p v-for="log in logsStore.logs" :key="log.id">
        <span class="text-slate-500">{{ log.time }}</span>
        <span :class="log.level === 'error' ? 'text-rose-400' : log.level === 'warn' ? 'text-amber-400' : 'text-slate-200'">
          [{{ log.level.toUpperCase() }}]
        </span>
        <span>{{ log.message }}</span>
      </p>
      <p v-if="!logsStore.logs.length" class="text-slate-500">Sem logs recebidos.</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useLogsStore } from '@/stores/logs';

const logsStore = useLogsStore();
</script>
