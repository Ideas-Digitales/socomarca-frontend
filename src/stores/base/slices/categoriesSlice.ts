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
  searchCategories: null,

  // Acciones
  setCategories: (categories) => {
    set({ categories });
  },

  setSearchCategories: (categories) => {
    set({ searchCategories: categories });
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await fetchGetCategories();

      if (response.ok && response.data) {
        const categories = response.data.data || response.data;

        if (process.env.NODE_ENV === 'development') {
          console.info('[categories]', {
            supercategories: categories.length,
            categories: categories.reduce(
              (total: number, category: any) => total + (category.categories?.length ?? 0),
              0
            ),
            subcategories: categories.reduce(
              (total: number, category: any) =>
                total +
                (category.categories ?? []).reduce(
                  (subtotal: number, child: any) => subtotal + (child.subcategories?.length ?? 0),
                  0
                ),
              0
            ),
            sample: categories[0],
          });
        }

        set({
          categories,
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
