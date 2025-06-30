import { StateCreator } from 'zustand';
import { CategoriesSlice, StoreState } from '../types';
import { fetchGetCategories } from '@/services/actions/categories.actions';

export const createCategoriesSlice: StateCreator<
  StoreState & CategoriesSlice,
  [],
  [],
  CategoriesSlice
> = (set) => ({
  // Estado inicial
  categories: [],

  // Acciones
  setCategories: (categories) => {
    set({ categories });
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await fetchGetCategories();

      if (response.ok && response.data) {
        set({
          categories: response.data.data || response.data,
          isLoading: false,
        });
      } else {
        console.error('Error en la respuesta del servidor:', response.error);
        set({
          categories: [],
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({
        categories: [],
        isLoading: false,
      });
    }
  },
});
