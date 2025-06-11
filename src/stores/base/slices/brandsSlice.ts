import { StateCreator } from 'zustand';
import { BrandsSlice, StoreState } from '../types';
import { fetchGetBrands } from '@/services/actions/brands.actions';

export const createBrandsSlice: StateCreator<
  StoreState & BrandsSlice,
  [],
  [],
  BrandsSlice
> = (set) => ({
  setBrands: (brands) => {
    set({
      brands: brands,
    });
  },
  fetchBrands: async () => {
    try {
      set({ isLoading: true });
      const response = await fetchGetBrands();

      if (response.ok && response.data) {
        set({
          brands: response.data.data || response.data,
          isLoading: false,
        });
      } else {
        console.error('Error en la respuesta del servidor:', response.error);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      set({ isLoading: false });
    }
  },
});
