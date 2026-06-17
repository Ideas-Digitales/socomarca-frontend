import { StateCreator } from 'zustand';
import { FiltersSlice, PaginationSlice, ProductsSlice, StoreState } from '../types';
import { SearchWithPaginationProps } from '@/interfaces/product.interface';
import { addSelectedCategoryFilter } from './filterSlice';

export const createPaginationSlice: StateCreator<
  StoreState & PaginationSlice & ProductsSlice & FiltersSlice,
  [],
  [],
  PaginationSlice
> = (set, get) => ({
  setProductPage: (page: number) => {
    const { 
      searchTerm, 
      productPaginationMeta,
      selectedSupercategoryId,
      selectedCategoryId,
      selectedSubcategoryId,
      selectedBrands,
      selectedMinPrice,
      selectedMaxPrice,
      isFiltered,
      fetchProducts,
      setSearchTerm
    } = get();
    const size = productPaginationMeta?.per_page || 9;

    if (searchTerm || isFiltered) {
      const searchParams: SearchWithPaginationProps = {
        field: 'name',
        value: searchTerm,
        operator: 'fulltext',
        page,
        size,
        min: selectedMinPrice,
        max: selectedMaxPrice,
        brand_id: selectedBrands
      };

      addSelectedCategoryFilter(
        searchParams,
        selectedSupercategoryId,
        selectedCategoryId,
        selectedSubcategoryId
      );

      // Si hay búsqueda o filtros activos, usar setSearchTerm
      setSearchTerm(searchParams);
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
