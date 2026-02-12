import { storeToRefs } from 'pinia';
import { useLogsStore } from '@/stores/logs';

export const useLogs = () => {
  const store = useLogsStore();
  const { logs } = storeToRefs(store);

  return {
    logs,
    append: store.append,
  };
};
