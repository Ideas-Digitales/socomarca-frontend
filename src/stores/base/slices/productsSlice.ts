import { StateCreator } from 'zustand';
import {
  PaginationLinks,
  PaginationMeta,
  ProductsSlice,
  StoreState,
  FiltersSlice,
} from '../types';
import { fetchGetProducts } from '@/services/actions/products.actions';
import { filterAndRankProducts } from '../utils/searchUtils';

export const createProductsSlice: StateCreator<
  StoreState & ProductsSlice & FiltersSlice,
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
      productPaginationMeta: meta || get().productPaginationMeta,
      productPaginationLinks: links || get().productPaginationLinks,
    });
  },

  setFilteredProducts: (filteredProducts) => {
    const currentMeta = get().productPaginationMeta;

    if (!currentMeta) {
      set({ filteredProducts });
      return;
    }

    const perPage = currentMeta.per_page || 9;
    const lastPage = Math.max(1, Math.ceil(filteredProducts.length / perPage));

    const updatedMeta: PaginationMeta = {
      ...currentMeta,
      current_page: 1,
      from: filteredProducts.length > 0 ? 1 : 0,
      last_page: lastPage,
      to: Math.min(filteredProducts.length, perPage),
      total: filteredProducts.length,
      links: Array.from({ length: lastPage }, (_, i) => ({
        url: i === 0 ? null : `?page=${i + 1}`,
        label:
          i === 0
            ? 'Previous'
            : i === lastPage - 1
            ? 'Next'
            : (i + 1).toString(),
        active: i === 0,
      })),
    };

    // Update navigation links
    const updatedLinks: PaginationLinks = {
      first: filteredProducts.length > 0 ? '?page=1' : null,
      last: filteredProducts.length > 0 ? `?page=${lastPage}` : null,
      next: 1 < lastPage ? '?page=2' : null,
      prev: null,
    };

    set({
      filteredProducts,
      productPaginationMeta: updatedMeta,
      productPaginationLinks: updatedLinks,
      currentPage: 1,
    });
  },

  setSearchTerm: (term: string) => {
    const { products, clearAllFilters } = get();

    // Si hay un término de búsqueda, limpiar filtros primero
    if (term.trim()) {
      clearAllFilters();
    }

    // Apply search term filter
    const filtered = term ? filterAndRankProducts(products, term) : products;

    set({ searchTerm: term });

    get().setFilteredProducts(filtered);
  },

  fetchProducts: async (page = 1, size = 9) => {
    try {
      set({ isLoading: true });
      const response = await fetchGetProducts({ page, size });

      if (response.ok && response.data) {
        set({
          products: response.data.data,
          filteredProducts: response.data.data,
          productPaginationMeta: response.data.meta,
          productPaginationLinks: response.data.links,
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
