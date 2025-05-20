'use client';

// store/index.ts
import { create } from 'zustand';
import { useEffect } from 'react';
import { IS_QA_MODE } from '@/utils/getEnv';
import { Store, StoreState } from './types';
import { createCartSlice } from './slices/cartSlice';
import { createCategoriesSlice } from './slices/categoriesSlice';
import { createPaginationSlice } from './slices/paginationSlice';
import { createProductsSlice } from './slices/productsSlice';
import { createUiSlice } from './slices/uiSlice';

// Estado inicial
const initialState: StoreState = {
  products: [],
  categories: [],
  filteredProducts: [],
  isLoading: false,
  searchTerm: '',
  isMobile: false,
  isTablet: false,
  cartProducts: [],
  paginationMeta: null,
  currentPage: 1,
  isQaMode: IS_QA_MODE,
};

// Crear el store combinando todos los slices
const useStore = create<Store>()((...a) => ({
  ...initialState,
  ...createProductsSlice(...a),
  ...createCategoriesSlice(...a),
  ...createUiSlice(...a),
  ...createCartSlice(...a),
  ...createPaginationSlice(...a),
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
