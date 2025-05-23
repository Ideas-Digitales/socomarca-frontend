import { StateCreator } from 'zustand';
import { CategoriesSlice, StoreState } from '../types';
import { fetchGetCategories } from '@/services/actions/categories.actions';

export const createCategoriesSlice: StateCreator<
  StoreState & CategoriesSlice,
  [],
  [],
  CategoriesSlice
> = (set) => ({
  setCategories: (categories) => {
    set({
      categories: categories,
    });
  },
  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await fetchGetCategories();

      if (response.ok && response.data) {
        console.log('Categorías obtenidas:', response.data, response.ok);
        set({
          categories: response.data.data || response.data,
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
