import { StateCreator } from 'zustand';
import { FiltersSlice, StoreState, ProductsSlice } from '../types';
import {
  Product,
  SearchWithPaginationProps,
} from '@/interfaces/product.interface';
import { fetchSearchProductsByFilters } from '@/services/actions/products.actions';

export const createFiltersSlice: StateCreator<
  StoreState & FiltersSlice & ProductsSlice,
  [],
  [],
  FiltersSlice
> = (set, get) => ({
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

  // Acciones para manejar categorías
  setSelectedCategories: (categories) => {
    set({ selectedCategories: categories });
  },

  toggleCategorySelection: (categoryId) => {
    const { selectedCategories } = get();
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    set({ selectedCategories: newSelection });
  },

  // Acciones para manejar marcas
  setSelectedBrands: (brands) => {
    set({ selectedBrands: brands });
  },

  toggleBrandSelection: (brandId) => {
    const { selectedBrands } = get();
    const newSelection = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];

    set({ selectedBrands: newSelection });
  },

  // Acciones para manejar favoritos
  setSelectedFavorites: (favorites) => {
    set({ selectedFavorites: favorites });
  },

  toggleFavoriteSelection: (favoriteId) => {
    const { selectedFavorites } = get();
    const newSelection = selectedFavorites.includes(favoriteId)
      ? selectedFavorites.filter((id) => id !== favoriteId)
      : [...selectedFavorites, favoriteId];

    set({ selectedFavorites: newSelection });
  },

  // Acciones para manejar precios
  setPriceRange: (min, max, lower, upper) => {
    set({
      minPrice: min,
      maxPrice: max,
      lowerPrice: lower,
      upperPrice: upper,
      priceInitialized: true,
    });
  },

  setLowerPrice: (price) => {
    const { minPrice, upperPrice } = get();
    const boundedPrice = Math.max(minPrice, Math.min(price, upperPrice));
    set({ lowerPrice: boundedPrice });
  },

  setUpperPrice: (price) => {
    const { maxPrice, lowerPrice } = get();
    const boundedPrice = Math.min(maxPrice, Math.max(price, lowerPrice));
    set({ upperPrice: boundedPrice });
  },

  handlePriceRangeChange: (lower, upper) => {
    set({ lowerPrice: lower, upperPrice: upper });
  },

  // CORREGIDO: Inicializar rango de precios basado en productos mostrados
  initializePriceRange: (products) => {
    if (!products || products.length === 0) {
      // Si no hay productos, mantener valores mínimos
      set({
        minPrice: 0,
        maxPrice: 1000,
        lowerPrice: 0,
        upperPrice: 1000,
        priceInitialized: true,
      });
      return;
    }

    const validPrices = products
      .map((product) => product.price || 0)
      .filter((price) => !isNaN(price) && price >= 0);

    if (validPrices.length > 0) {
      const min = Math.floor(Math.min(...validPrices));
      let max = Math.ceil(Math.max(...validPrices));

      if (min === max) {
        max = min + 1000; // Dar un rango mínimo
      }

      const { priceInitialized, lowerPrice, upperPrice } = get();

      // CORREGIDO: Siempre actualizar min/max, pero preservar lower/upper si ya están configurados
      if (!priceInitialized) {
        set({
          minPrice: min,
          maxPrice: max,
          lowerPrice: min,
          upperPrice: max,
          priceInitialized: true,
        });
      } else {
        // Actualizar rangos pero mantener selección del usuario si está dentro del nuevo rango
        const newLowerPrice = Math.max(min, Math.min(lowerPrice, max));
        const newUpperPrice = Math.min(max, Math.max(upperPrice, min));

        set({
          minPrice: min,
          maxPrice: max,
          lowerPrice: newLowerPrice,
          upperPrice: newUpperPrice,
        });
      }
    }
  },

  // Acciones para manejar el estado de UI de filtros
  setMainCategoryOpen: (isOpen) => {
    set({ isMainCategoryOpen: isOpen });
  },

  setBrandsOpen: (isOpen) => {
    set({ isBrandsOpen: isOpen });
  },

  setFavoritesOpen: (isOpen) => {
    set({ isFavoritesOpen: isOpen });
  },

  setPriceOpen: (isOpen) => {
    set({ isPriceOpen: isOpen });
  },

  toggleMainCategory: () => {
    const { isMainCategoryOpen } = get();
    set({ isMainCategoryOpen: !isMainCategoryOpen });
  },

  toggleBrandsSection: () => {
    const { isBrandsOpen } = get();
    set({ isBrandsOpen: !isBrandsOpen });
  },

  toggleFavoritesSection: () => {
    const { isFavoritesOpen } = get();
    set({ isFavoritesOpen: !isFavoritesOpen });
  },

  togglePriceSection: () => {
    const { isPriceOpen } = get();
    set({ isPriceOpen: !isPriceOpen });
  },

  // FUNCIÓN PRINCIPAL - APLICAR FILTROS CON BACKEND
  applyFilters: async () => {
    const {
      selectedCategories,
      selectedBrands,
      selectedFavorites,
      lowerPrice,
      upperPrice,
      minPrice,
      maxPrice,
      productPaginationMeta,
      initializePriceRange,
    } = get();

    try {
      set({ isLoadingProducts: true });

      // Construir parámetros de búsqueda
      const searchParams: SearchWithPaginationProps = {
        page: 1, // Resetear a primera página
        size: productPaginationMeta?.per_page || 9,
      };

      // Determinar filtro principal para el backend
      let hasBackendFilter = false;

      // Prioridad 1: Filtro por categorías (usar la primera categoría seleccionada)
      if (selectedCategories.length > 0) {
        searchParams.field = 'category_id';
        searchParams.value = selectedCategories[0].toString();
        searchParams.operator = '=';
        hasBackendFilter = true;
      }
      // Prioridad 2: Filtro por marcas (si no hay categorías)
      else if (selectedBrands.length > 0) {
        searchParams.field = 'brand_id';
        searchParams.value = selectedBrands[0].toString();
        searchParams.operator = '=';
        hasBackendFilter = true;
      }

      // Agregar filtros de precio si están activos
      const hasPriceFilter = lowerPrice > minPrice || upperPrice < maxPrice;
      if (hasPriceFilter) {
        searchParams.min = lowerPrice;
        searchParams.max = upperPrice;
      }

      // Si no hay filtros de backend, usar todos los productos
      let response;
      if (hasBackendFilter || hasPriceFilter) {
        response = await fetchSearchProductsByFilters(searchParams);
      } else {
        // Si no hay filtros de backend, usar fetchProducts normal
        const { fetchProducts } = get();
        await fetchProducts(1, searchParams.size);
        set({ isLoadingProducts: false });
        return;
      }

      if (response.ok && response.data) {
        let filteredProducts = response.data.data;

        // FILTROS ADICIONALES DEL LADO CLIENTE

        // Filtrar por múltiples categorías (si hay más de una seleccionada)
        if (selectedCategories.length > 1) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            selectedCategories.includes(product.category.id)
          );
        }

        // Filtrar por múltiples marcas (si hay más de una seleccionada)
        if (selectedBrands.length > 1) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            selectedBrands.includes(product.brand.id)
          );
        }

        // Filtrar por favoritos
        if (selectedFavorites.length > 0) {
          filteredProducts = filteredProducts.filter(
            (product: Product) =>
              product.is_favorite && selectedFavorites.includes(product.id)
          );
        }

        // CORREGIDO: Actualizar rango de precios basado en productos filtrados
        initializePriceRange(filteredProducts);

        // Actualizar estado con productos filtrados
        const updatedMeta = {
          ...response.data.meta,
          total: filteredProducts.length,
          to: Math.min(filteredProducts.length, response.data.meta.per_page),
          from: filteredProducts.length > 0 ? 1 : 0,
          last_page: Math.max(
            1,
            Math.ceil(filteredProducts.length / response.data.meta.per_page)
          ),
        };

        set({
          filteredProducts,
          productPaginationMeta: updatedMeta,
          productPaginationLinks: response.data.links,
          currentPage: 1,
          isLoadingProducts: false,
        });

        console.log('Filtros aplicados:', {
          categorias: selectedCategories,
          marcas: selectedBrands,
          favoritos: selectedFavorites,
          precio: { min: lowerPrice, max: upperPrice },
          resultados: filteredProducts.length,
        });
      } else {
        console.error('Error aplicando filtros:', response.error);
        set({ isLoadingProducts: false });
      }
    } catch (error) {
      console.error('Error en applyFilters:', error);
      set({ isLoadingProducts: false });
    }
  },

  // CORREGIDO: Limpiar todos los filtros y recargar productos
  clearAllFilters: async () => {
    const { fetchProducts, productPaginationMeta } = get();

    // Resetear estados de filtros
    set({
      selectedCategories: [],
      selectedBrands: [],
      selectedFavorites: [],
      searchTerm: '',
      // NO resetear precios aquí, se actualizarán cuando se carguen los productos
    });

    // Recargar productos originales
    try {
      await fetchProducts(1, productPaginationMeta?.per_page || 9);
      console.log('Filtros limpiados y productos recargados');
    } catch (error) {
      console.error('Error al limpiar filtros:', error);
    }
  },

  // Resetear completamente el estado de filtros
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

  // Verificar si hay filtros activos
  hasActiveFilters: () => {
    const {
      selectedCategories,
      selectedBrands,
      selectedFavorites,
      lowerPrice,
      upperPrice,
      minPrice,
      maxPrice,
    } = get();

    return (
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      selectedFavorites.length > 0 ||
      lowerPrice !== minPrice ||
      upperPrice !== maxPrice
    );
  },
});
