import { StateCreator } from 'zustand';
import { PaginationSlice, ProductsSlice, StoreState } from '../types';

export const createPaginationSlice: StateCreator<
  StoreState & PaginationSlice & ProductsSlice,
  [],
  [],
  PaginationSlice
> = (set, get) => ({
  setProductPage: (page: number) => {
    set({ currentPage: page });
    get().fetchProducts(page);
  },

  nextPage: () => {
    const { currentPage, productPaginationMeta } = get();
    if (productPaginationMeta && currentPage < productPaginationMeta.total) {
      const nextPage = currentPage + 1;
      set({ currentPage: nextPage });
      get().fetchProducts(nextPage);
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      set({ currentPage: prevPage });
      get().fetchProducts(prevPage);
    }
  },
});
