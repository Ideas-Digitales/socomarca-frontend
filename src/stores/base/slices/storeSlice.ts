import { StateCreator } from 'zustand';
import {
  StoreSlice,
  StoreState,
  BrandsSlice,
  CategoriesSlice,
  ProductsSlice,
  FiltersSlice,
} from '../types';

export const createStoreSlice: StateCreator<
  StoreState &
    StoreSlice &
    BrandsSlice &
    CategoriesSlice &
    ProductsSlice &
    FiltersSlice,
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

  // CORREGIDO: Resetear estados y recargar productos
  resetSearchRelatedStates: async () => {
    const { fetchProducts, productPaginationMeta } = get();

    set({
      searchTerm: '',
      selectedCategories: [],
      selectedBrands: [],
      selectedFavorites: [],
      isLoading: false,
    });

    try {
      await fetchProducts(1, productPaginationMeta?.per_page || 9);
      console.log('Estados de búsqueda reseteados y productos recargados');
    } catch (error) {
      console.error('Error al resetear estados de búsqueda:', error);
    }
  },

  resetAllStates: async () => {
    const { resetSearchRelatedStates } = get();
    await resetSearchRelatedStates();
  },
});
