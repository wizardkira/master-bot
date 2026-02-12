import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface LogLine {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  time: string;
}

export const useLogsStore = defineStore('logs', () => {
  const logs = ref<LogLine[]>([]);

  const append = (level: LogLine['level'], message: string) => {
    logs.value.unshift({
      id: crypto.randomUUID(),
      level,
      message,
      time: new Date().toLocaleTimeString(),
    });
    logs.value = logs.value.slice(0, 300);
  };

  return {
    logs,
    append,
  };
});
