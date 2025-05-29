import { StateCreator } from 'zustand';
import { StoreSlice, StoreState, BrandsSlice, CategoriesSlice, ProductsSlice, FiltersSlice } from '../types';

export const createStoreSlice: StateCreator<
  StoreState & StoreSlice & BrandsSlice & CategoriesSlice & ProductsSlice & FiltersSlice,
  [],
  [],
  StoreSlice
> = (set, get) => ({
  resetBrandsState: () => {
    set({
      brands: [],
    });
  },

  resetCategoriesState: () => {
    set({
      categories: [],
    });
  },

  resetProductsState: () => {
    set({
      products: [],
      filteredProducts: [],
      productPaginationMeta: null,
      productPaginationLinks: null,
      currentPage: 1,
    });
  },

  resetFiltersState: () => {
    set({
      selectedCategories: [],
      selectedBrands: [],
      selectedFavorites: [],
      minPrice: 0,
      maxPrice: 0,
      lowerPrice: 0,
      upperPrice: 0,
      priceInitialized: false,
      isMainCategoryOpen: true,
      isBrandsOpen: false,
      isFavoritesOpen: false,
      isPriceOpen: true,
    });
  },

  resetSearchRelatedStates: () => {
    const { resetBrandsState, resetCategoriesState, resetProductsState, resetFiltersState } = get();
    
    // Resetear todos los estados relacionados con la búsqueda
    resetBrandsState();
    resetCategoriesState();
    resetProductsState();
    resetFiltersState();
    
    // También resetear el término de búsqueda
    set({
      searchTerm: '',
      isLoading: false,
    });
  },

  resetAllStates: () => {
    const { resetSearchRelatedStates } = get();
    
    resetSearchRelatedStates();
    
  },
});