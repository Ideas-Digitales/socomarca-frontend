import { StateCreator } from 'zustand';
import { StoreState, UiSlice } from '../types';

export const createUiSlice: StateCreator<
  StoreState & UiSlice,
  [],
  [],
  UiSlice
> = (set, get) => ({
  // Estados de UI
  isMobile: false,
  isTablet: false,
  viewMode: 'grid',

  // Acciones
  checkIsMobile: () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 640;
      set({ isMobile });

      if (isMobile && get().viewMode === 'grid') {
        set({ viewMode: 'list' });
      }
    }
  },

  checkIsTablet: () => {
    if (typeof window !== 'undefined') {
      const isTablet = window.innerWidth < 1024;
      set({ isTablet });
    }
  },

  setViewMode: (mode: 'grid' | 'list') => {
    if (mode === 'grid' && get().isMobile) {
      return;
    }
    set({ viewMode: mode });
  },
});
