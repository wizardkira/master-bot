<template>
  <section class="space-y-6">
    <Dashboard />

    <div class="grid gap-4 lg:grid-cols-3">
      <SmartSniperPanel />
      <OldCoinsPanel />
      <TractionPanel />
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <PositionsTable />
      <KPIChart />
    </div>

    <LogsViewer />
  </section>
</template>

<script setup lang="ts">
import Dashboard from '@/components/Dashboard.vue';
import KPIChart from '@/components/KPIChart.vue';
import LogsViewer from '@/components/LogsViewer.vue';
import OldCoinsPanel from '@/components/OldCoinsPanel.vue';
import PositionsTable from '@/components/PositionsTable.vue';
import SmartSniperPanel from '@/components/SmartSniperPanel.vue';
import TractionPanel from '@/components/TractionPanel.vue';
import { useWebSocket } from '@/composables/useWebSocket';

useWebSocket();
</script>
