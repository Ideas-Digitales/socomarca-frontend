import { StateCreator } from 'zustand';
import { StoreState, UiSlice } from '../types';

export const createUiSlice: StateCreator<
  StoreState & UiSlice,
  [],
  [],
  UiSlice
> = (set) => ({
  checkIsMobile: () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 640;
      set({ isMobile });
    }
  },

  checkIsTablet: () => {
    if (typeof window !== 'undefined') {
      const isTablet = window.innerWidth < 1024;
      set({ isTablet });
    }
  },
});
