import { StateCreator } from 'zustand';
import { PaginationSlice, ProductsSlice, StoreState } from '../types';

export const createPaginationSlice: StateCreator<
  StoreState & PaginationSlice & ProductsSlice,
  [],
  [],
  PaginationSlice
> = (set, get) => ({
  setProductPage: (page: number) => {
    const { 
      searchTerm, 
      productPaginationMeta,
      selectedCategories,
      selectedBrands,
      selectedMinPrice,
      selectedMaxPrice,
      isFiltered,
      fetchProducts,
      setSearchTerm
    } = get();
    const size = productPaginationMeta?.per_page || 9;

    if (searchTerm || isFiltered) {
      // Si hay búsqueda o filtros activos, usar setSearchTerm
      setSearchTerm({
        field: 'name',
        value: searchTerm,
        operator: 'fulltext',
        page,
        size,
        min: selectedMinPrice,
        max: selectedMaxPrice,
        category_id: selectedCategories[0],
        brand_id: selectedBrands
      });
    } else {
      // Si no hay búsqueda ni filtros, usar fetchProducts
      fetchProducts(page, size);
    }
  },

  nextPage: () => {
    const { currentPage, productPaginationMeta } = get();
    if (productPaginationMeta && currentPage < productPaginationMeta.last_page) {
      const nextPage = currentPage + 1;
      get().setProductPage(nextPage);
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      get().setProductPage(prevPage);
    }
  },
});
