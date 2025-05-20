import { StateCreator } from 'zustand';
import { CategoriesSlice, StoreState } from '../types';
import { fetchGetCategories } from '@/services/actions/categories.actions';

export const createCategoriesSlice: StateCreator<
  StoreState & CategoriesSlice,
  [],
  [],
  CategoriesSlice
> = (set) => ({
  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await fetchGetCategories();

      if (response.ok && response.data) {
        console.log(response.data);
        set({
          categories: response.data,
          isLoading: false,
        });
      } else {
        console.error('Error en la respuesta del servidor:', response.error);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ isLoading: false });
    }
  },
});
