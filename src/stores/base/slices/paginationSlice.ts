import { StateCreator } from 'zustand';
import { PaginationSlice, ProductsSlice, StoreState } from '../types';

export const createPaginationSlice: StateCreator<
  StoreState & PaginationSlice & ProductsSlice,
  [],
  [],
  PaginationSlice
> = (set, get) => ({
  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchProducts(page);
  },

  nextPage: () => {
    const { currentPage, paginationMeta } = get();
    if (paginationMeta && currentPage < paginationMeta.total) {
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
