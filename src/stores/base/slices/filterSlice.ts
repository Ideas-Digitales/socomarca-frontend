import { StateCreator } from 'zustand';
import {
  FiltersSlice,
  StoreState,
  ProductsSlice,
  FavoritesSlice,
} from '../types';
import {
  Product,
  SearchWithPaginationProps,
} from '@/interfaces/product.interface';
import { fetchSearchProductsByFilters } from '@/services/actions/products.actions';

export const createFiltersSlice: StateCreator<
  StoreState & FiltersSlice & ProductsSlice & FavoritesSlice,
  [],
  [],
  FiltersSlice
> = (set, get) => ({
  // Estados de filtros
  selectedCategories: [],
  selectedBrands: [],
  selectedFavorites: [],

  // Rango total disponible (del backend)
  minPrice: 0,
  maxPrice: 0,
  // Rango seleccionado por el usuario (posición de los thumbs)
  selectedMinPrice: 0,
  selectedMaxPrice: 0,

  // Flag para indicar si el usuario ha hecho una selección específica
  hasUserSpecificSelection: false,

  // Legacy (mantener compatibilidad)
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

  // Nuevas acciones para manejo separado de rangos
  setAvailablePriceRange: (min, max) => {
    set({
      minPrice: min,
      maxPrice: max,
      priceInitialized: true,
    });
  },
  setSelectedPriceRange: (selectedMin, selectedMax) => {
    const { minPrice, maxPrice } = get();
    const boundedMin = Math.max(minPrice, Math.min(selectedMin, maxPrice));
    const boundedMax = Math.min(maxPrice, Math.max(selectedMax, minPrice));

    // Determinar si es una selección específica (no está en los extremos)
    const isSpecificSelection = boundedMin > minPrice || boundedMax < maxPrice;

    set({
      selectedMinPrice: boundedMin,
      selectedMaxPrice: boundedMax,
      hasUserSpecificSelection: isSpecificSelection,
      // Mantener compatibilidad con legacy
      lowerPrice: boundedMin,
      upperPrice: boundedMax,
    });
  },
  setSelectedMinPrice: (price) => {
    const { minPrice, selectedMaxPrice, maxPrice } = get();
    const boundedPrice = Math.max(minPrice, Math.min(price, selectedMaxPrice));

    // Determinar si es una selección específica
    const isSpecificSelection =
      boundedPrice > minPrice || selectedMaxPrice < maxPrice;

    set({
      selectedMinPrice: boundedPrice,
      lowerPrice: boundedPrice, // Legacy
      hasUserSpecificSelection: isSpecificSelection,
    });
  },

  setSelectedMaxPrice: (price) => {
    const { maxPrice, selectedMinPrice, minPrice } = get();
    const boundedPrice = Math.min(maxPrice, Math.max(price, selectedMinPrice));

    // Determinar si es una selección específica
    const isSpecificSelection =
      selectedMinPrice > minPrice || boundedPrice < maxPrice;

    set({
      selectedMaxPrice: boundedPrice,
      upperPrice: boundedPrice, // Legacy
      hasUserSpecificSelection: isSpecificSelection,
    });
  },
  handlePriceRangeChange: (lower, upper) => {
    const { setSelectedPriceRange } = get();
    setSelectedPriceRange(lower, upper);
  }, // Inicializar rango de precios basado en productos mostrados
  initializePriceRange: (products) => {
    if (!products || products.length === 0) {
      const { hasUserSpecificSelection, priceInitialized } = get();

      // Solo actualizar si no hay inicialización previa o no hay selección del usuario
      if (!priceInitialized || !hasUserSpecificSelection) {
        set({
          minPrice: 0,
          maxPrice: 1000,
          selectedMinPrice: 0,
          selectedMaxPrice: 1000,
          lowerPrice: 0,
          upperPrice: 1000,
          priceInitialized: true,
          hasUserSpecificSelection: false,
        });
      }
      return;
    }

    const allPrices = products.map((product) => {
      let price = product.price;

      // Convertir string a number si es necesario
      if (typeof price === 'string') {
        price = parseFloat(
          (price as string).replace(/[^\d.,]/g, '').replace(',', '.')
        );
      }

      return price;
    });

    const validPrices = allPrices.filter(
      (price) => !isNaN(price) && price >= 0
    );

    if (validPrices.length > 0) {
      const min = Math.floor(Math.min(...validPrices));
      let max = Math.ceil(Math.max(...validPrices));

      // Asegurar que max > min
      if (min === max) {
        max = min + 100;
      }
      const { selectedMinPrice, selectedMaxPrice, hasUserSpecificSelection } =
        get();

      if (hasUserSpecificSelection) {
        const adjustedMin = Math.max(min, selectedMinPrice);
        const adjustedMax = Math.min(max, selectedMaxPrice);

        // Asegurar que adjustedMin <= adjustedMax
        const finalMin = Math.min(adjustedMin, adjustedMax);
        const finalMax = Math.max(adjustedMin, adjustedMax);

        set({
          minPrice: min,
          maxPrice: max,
          selectedMinPrice: finalMin,
          selectedMaxPrice: finalMax,
          lowerPrice: finalMin,
          upperPrice: finalMax,
          priceInitialized: true,
          // Mantener el flag de selección específica
          hasUserSpecificSelection: true,
        });
      } else {
        // No hay selección específica, usar el rango completo
        set({
          minPrice: min,
          maxPrice: max,
          selectedMinPrice: min,
          selectedMaxPrice: max,
          lowerPrice: min,
          upperPrice: max,
          priceInitialized: true,
          hasUserSpecificSelection: false,
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
  }, // Aplicar filtros con conexión al backend
  applyFilters: async () => {
    const {
      selectedCategories,
      selectedBrands,
      selectedFavorites,
      selectedMinPrice,
      selectedMaxPrice,
      minPrice,
      maxPrice,
      productPaginationMeta,
      initializePriceRange,
      showOnlyFavorites,
      setAvailablePriceRange,
    } = get();

    try {
      set({ isLoadingProducts: true });

      // Construir parámetros de búsqueda con la nueva estructura
      const searchParams: SearchWithPaginationProps = {
        page: 1,
        size: productPaginationMeta?.per_page || 9,
        // Precio siempre va
        min: selectedMinPrice,
        max: selectedMaxPrice,
        unit: 'kg', // Proporcionar valor por defecto
      };

      // Agregar filtros solo si están seleccionados
      if (selectedCategories.length > 0) {
        searchParams.category_id = selectedCategories[0];
      }

      if (selectedBrands.length > 0) {
        searchParams.brand_id = selectedBrands[0];
      }

      if (showOnlyFavorites) {
        searchParams.is_favorite = true;
      }

      // Determinar si hay algún filtro activo
      const hasActiveFilter =
        selectedCategories.length > 0 ||
        selectedBrands.length > 0 ||
        showOnlyFavorites ||
        selectedMinPrice !== minPrice ||
        selectedMaxPrice !== maxPrice;

      let response;
      if (hasActiveFilter) {
        response = await fetchSearchProductsByFilters(searchParams);
      } else {
        // Caso normal: cargar todos los productos sin filtros especiales
        const { fetchProducts } = get();
        await fetchProducts(1, searchParams.size);
        set({ isLoadingProducts: false });
        return;
      }
      if (response.ok && response.data) {
        let filteredProducts = response.data.data; // Manejar filtros del backend si están disponibles
        if (response.data.filters) {
          const backendFilters = response.data.filters;

          // Si el backend devuelve min_price y max_price, actualizar el rango disponible
          if (
            backendFilters.min_price !== null &&
            backendFilters.max_price !== null
          ) {
            const backendMin = backendFilters.min_price;
            const backendMax = backendFilters.max_price;

            const {
              selectedMinPrice,
              selectedMaxPrice,
              hasUserSpecificSelection,
            } = get();

            // Actualizar rango disponible del backend
            setAvailablePriceRange(backendMin, backendMax);

            if (hasUserSpecificSelection) {
              // El usuario había seleccionado un rango específico, mantenerlo pero ajustarlo si es necesario
              const adjustedMin = Math.max(backendMin, selectedMinPrice);
              const adjustedMax = Math.min(backendMax, selectedMaxPrice);

              // Asegurar que adjustedMin <= adjustedMax
              const finalMin = Math.min(adjustedMin, adjustedMax);
              const finalMax = Math.max(adjustedMin, adjustedMax);

              set({
                selectedMinPrice: finalMin,
                selectedMaxPrice: finalMax,
                lowerPrice: finalMin,
                upperPrice: finalMax,
                hasUserSpecificSelection: true,
              });

            } else {
              set({
                selectedMinPrice: backendMin,
                selectedMaxPrice: backendMax,
                lowerPrice: backendMin,
                upperPrice: backendMax,
                hasUserSpecificSelection: false,
              });
            }
          }
        }

        // Filtros del lado cliente

        // Filtrar por múltiples categorías
        if (selectedCategories.length > 1) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            selectedCategories.includes(product.category.id)
          );
        }

        // Filtrar por múltiples marcas
        if (selectedBrands.length > 1) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            selectedBrands.includes(product.brand.id)
          );
        }

        // Filtrar por favoritos específicos (si se implementa selección múltiple)
        if (selectedFavorites.length > 0) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            selectedFavorites.includes(product.id)
          );
        }
        if (
          !response.data.filters ||
          response.data.filters.min_price === null ||
          response.data.filters.max_price === null
        ) {
          initializePriceRange(filteredProducts);
        }

        // Actualizar estado
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
      } else {
        console.error('Error aplicando filtros:', response.error);
        set({ isLoadingProducts: false });
      }
    } catch (error) {
      console.error('Error en applyFilters:', error);
      set({ isLoadingProducts: false });
    }
  },
  // Limpiar todos los filtros
  clearAllFilters: async () => {
    const { fetchProducts, productPaginationMeta } = get();

    // Resetear estados de filtros
    set({
      selectedCategories: [],
      selectedBrands: [],
      selectedFavorites: [],
      searchTerm: '',
      showOnlyFavorites: false,
    });

    // Recargar productos originales
    try {
      await fetchProducts(1, productPaginationMeta?.per_page || 9);
    } catch (error) {
      console.error('Error al limpiar filtros:', error);
    }
  }, // Resetear completamente el estado de filtros
  resetFiltersState: () => {
    set({
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
      isMainCategoryOpen: true,
      isBrandsOpen: false,
      isFavoritesOpen: false,
      isPriceOpen: true,
      showOnlyFavorites: false,
    });
  }, // Verificar si hay filtros activos
  hasActiveFilters: () => {
    const {
      selectedCategories,
      selectedBrands,
      selectedFavorites,
      selectedMinPrice,
      selectedMaxPrice,
      minPrice,
      maxPrice,
      showOnlyFavorites,
    } = get();

    return (
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      selectedFavorites.length > 0 ||
      selectedMinPrice !== minPrice ||
      selectedMaxPrice !== maxPrice ||
      showOnlyFavorites
    );
  },

  // Filtrar productos por marcas (función adicional si se necesita)
  filterProductsByBrands: () => {
    const { products, selectedBrands } = get();

    if (selectedBrands.length === 0) {
      set({ filteredProducts: products });
      return;
    }

    const filteredProducts = products.filter((product: Product) =>
      selectedBrands.includes(product.brand.id)
    );

    set({ filteredProducts });
  },
});
