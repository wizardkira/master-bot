import { storeToRefs } from 'pinia';
import { usePositionsStore } from '@/stores/positions';

export const usePositions = () => {
  const store = usePositionsStore();
  const { positions, activeCount, unrealizedPnLFormatted } = storeToRefs(store);

  return {
    positions,
    activeCount,
    unrealizedPnLFormatted,
    fetchPositions: store.fetchPositions,
  };
};
