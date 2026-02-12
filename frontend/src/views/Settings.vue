<template>
  <section class="space-y-4 rounded border border-slate-800 bg-slate-900/60 p-4">
    <h2 class="text-lg font-semibold">Configurações</h2>
    <p class="text-sm text-slate-400">As configurações de risco e conexão serão expandidas nas próximas fases.</p>
    <div class="grid gap-3 md:grid-cols-2">
      <label class="space-y-1 text-sm">
        <span>API URL</span>
        <input v-model="apiUrl" class="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
      </label>
      <label class="space-y-1 text-sm">
        <span>WebSocket URL</span>
        <input v-model="wsUrl" class="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const apiUrl = ref(import.meta.env.VITE_API_URL ?? 'http://localhost:3000');
const wsUrl = ref(import.meta.env.VITE_WS_URL ?? 'http://localhost:3000');
</script>
