'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { IS_QA_MODE } from '@/utils/getEnv';
import { Store, StoreState } from './types';
import { createCartSlice } from './slices/cartSlice';
import { createProductsSlice } from './slices/productsSlice';
import { createCategoriesSlice } from './slices/categoriesSlice';
import { createUiSlice } from './slices/uiSlice';
import { createPaginationSlice } from './slices/paginationSlice';
import { createSidebarSlice } from './slices/sidebarSlice';
import { createBrandsSlice } from './slices/brandsSlice';
import { createStoreSlice } from './slices/storeSlice';
import { createFiltersSlice } from './slices/filterSlice';

// Estado inicial
const initialState: StoreState = {
  products: [],
  categories: [],
  brands: [],
  filteredProducts: [],
  isLoading: false,
  searchTerm: '',
  isMobile: false,
  isTablet: false,
  viewMode: 'grid',
  cartProducts: [],
  productPaginationMeta: null,
  productPaginationLinks: null,
  currentPage: 1,
  isQaMode: IS_QA_MODE,
  activeItem: null,
  openSubmenus: [],
  isMobileSidebarOpen: false,
  // Estados de filtros
  selectedCategories: [],
  selectedBrands: [],
  selectedFavorites: [],
  minPrice: 0,
  maxPrice: 0,
  lowerPrice: 0,
  upperPrice: 0,
  priceInitialized: false,
  // Estados de UI de filtros
  isMainCategoryOpen: true,
  isBrandsOpen: false,
  isFavoritesOpen: false,
  isPriceOpen: true,
};

// Crear el store combinando todos los slices
const useStore = create<Store>()((...a) => ({
  ...initialState,
  ...createProductsSlice(...a),
  ...createCategoriesSlice(...a),
  ...createBrandsSlice(...a),
  ...createUiSlice(...a),
  ...createCartSlice(...a),
  ...createPaginationSlice(...a),
  ...createSidebarSlice(...a),
  ...createStoreSlice(...a),
  ...createFiltersSlice(...a),
}));

// Hook para manejar la detección de dispositivos móviles
export const useInitMobileDetection = () => {
  const checkIsMobile = useStore((state) => state.checkIsMobile);
  const checkIsTablet = useStore((state) => state.checkIsTablet);

  useEffect(() => {
    checkIsMobile();
    checkIsTablet();
    const handleResize = () => {
      checkIsMobile();
      checkIsTablet();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checkIsMobile, checkIsTablet]);
};

export default useStore;
