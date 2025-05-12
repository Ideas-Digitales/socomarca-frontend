import { create } from 'zustand';

// Define la interfaz para el estado
interface StoreState {
  counter: number;
  increment: () => void;
  decrement: () => void;
}

// Crea el store
const useStore = create<StoreState>((set) => ({
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  decrement: () => set((state) => ({ counter: state.counter - 1 })),
}));

export default useStore;
