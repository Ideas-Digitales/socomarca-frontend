'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { IS_QA_MODE } from '@/utils/getEnv';
import { Store, StoreState } from './types';
import { createAuthSlice } from './slices/authSlice';
import { createCartSlice } from './slices/cartSlice';
import { createProductsSlice } from './slices/productsSlice';
import { createCategoriesSlice } from './slices/categoriesSlice';
import { createUiSlice } from './slices/uiSlice';
import { createPaginationSlice } from './slices/paginationSlice';
import { createSidebarSlice } from './slices/sidebarSlice';
import { createBrandsSlice } from './slices/brandsSlice';
import { createStoreSlice } from './slices/storeSlice';
import { createFiltersSlice } from './slices/filterSlice';
import { createModalSlice } from './slices/modalSlice';
import { createFavoritesSlice } from './slices/favoritesSlice';

// Estado inicial optimizado
const initialState: StoreState = {
  // Auth states
  isLoggedIn: false,
  user: {
    id: 0,
    name: '',
    email: '',
    rut: '',
    roles: [],
  },
  token: '',
  isInitialized: false,

  // Loading states
  isLoading: false,
  isLoadingProducts: false,
  isCartLoading: false,
  isLoadingFavorites: false,

  // Product states
  products: [],
  filteredProducts: [],
  searchTerm: '',
  productPaginationMeta: null,
  productPaginationLinks: null,
  currentPage: 1,

  // Category & Brand states
  categories: [],
  brands: [],

  // UI states
  isMobile: false,
  isTablet: false,
  viewMode: 'grid',

  // Cart states
  cartProducts: [],

  // Favorites states
  favoriteLists: [],
  selectedFavoriteList: null,
  showOnlyFavorites: false,

  // Filter states
  selectedCategories: [],
  selectedBrands: [],
  selectedFavorites: [],
  minPrice: 0,
  maxPrice: 0,
  selectedMinPrice: 0,
  selectedMaxPrice: 0,
  hasUserSpecificSelection: false,
  lowerPrice: 0,
  upperPrice: 0,
  priceInitialized: false,

  // Filter UI states
  isMainCategoryOpen: true,
  isBrandsOpen: false,
  isFavoritesOpen: false,
  isPriceOpen: true,

  // Sidebar states
  activeItem: null,
  openSubmenus: [],
  isMobileSidebarOpen: false,
  currentSidebarConfig: null,

  // Modal states
  isModalOpen: false,
  modalTitle: '',
  modalSize: 'md',
  modalContent: null,

  // System states
  isQaMode: IS_QA_MODE,
};

// Crear el store combinando todos los slices de manera optimizada
const useStore = create<Store>()((...a) => ({
  ...initialState,
  ...createAuthSlice(...a),
  ...createProductsSlice(...a),
  ...createCategoriesSlice(...a),
  ...createBrandsSlice(...a),
  ...createUiSlice(...a),
  ...createCartSlice(...a),
  ...createPaginationSlice(...a),
  ...createSidebarSlice(...a),
  ...createStoreSlice(...a),
  ...createFiltersSlice(...a),
  ...createModalSlice(...a),
  ...createFavoritesSlice(...a),
}));

// Hook optimizado para manejar la detección de dispositivos móviles
export const useInitMobileDetection = () => {
  const checkIsMobile = useStore((state) => state.checkIsMobile);
  const checkIsTablet = useStore((state) => state.checkIsTablet);

  useEffect(() => {
    // Verificación inicial
    checkIsMobile();
    checkIsTablet();

    // Handler para cambios de tamaño
    const handleResize = () => {
      checkIsMobile();
      checkIsTablet();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checkIsMobile, checkIsTablet]);
};

// Hook para inicialización de autenticación
export const useAuthInitialization = () => {
  const initializeFromAuth = useStore((state) => state.initializeFromAuth);
  const isInitialized = useStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      initializeFromAuth();
    }
  }, [initializeFromAuth, isInitialized]);
};

export default useStore;
