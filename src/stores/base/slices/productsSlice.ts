import { StateCreator } from 'zustand';
import {
  PaginationLinks,
  PaginationMeta,
  ProductsSlice,
  StoreState,
} from '../types';
import { fetchGetProducts } from '@/services/actions/products.actions';
import { filterAndRankProducts } from '../utils/searchUtils';

export const createProductsSlice: StateCreator<
  StoreState & ProductsSlice,
  [],
  [],
  ProductsSlice
> = (set, get) => ({
  setProducts: (products, meta?: PaginationMeta, links?: PaginationLinks) => {
    const searchTerm = get().searchTerm;
    set({
      products,
      filteredProducts: searchTerm
        ? filterAndRankProducts(products, searchTerm)
        : products,
      paginationMeta: meta || get().paginationMeta,
      paginationLinks: links || get().paginationLinks,
    });
  },

  setSearchTerm: (term: string) => {
    const { products } = get();
    set({
      searchTerm: term,
      filteredProducts: term ? filterAndRankProducts(products, term) : products,
    });
  },

  fetchProducts: async (page = 1, size = 9) => {
    try {
      set({ isLoading: true });
      const response = await fetchGetProducts({ page, size });

      if (response.ok && response.data) {
        set({
          products: response.data.data,
          filteredProducts: response.data.data,
          paginationMeta: response.data.meta,
          paginationLinks: response.data.links,
          currentPage: response.data.meta.current_page,
          isLoading: false,
        });
      } else {
        console.error('Error en la respuesta del servidor:', response.error);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
    }
  },
});
