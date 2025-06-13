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

  // Inicializar rango de precios basado en productos mostrados
  initializePriceRange: (products) => {
    if (!products || products.length === 0) {
      set({
        minPrice: 0,
        maxPrice: 1000,
        lowerPrice: 0,
        upperPrice: 1000,
        priceInitialized: true,
      });
      return;
    }

    const allPrices = products.map((product) => {
      let price = product.price;

      // Convertir string a number si es necesario
      if (typeof price === 'string') {
        price = parseFloat((price as string).replace(/[^\d.,]/g, '').replace(',', '.'));
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

      // Siempre resetear la selección cuando se actualiza el rango
      set({
        minPrice: min,
        maxPrice: max,
        lowerPrice: min,
        upperPrice: max,
        priceInitialized: true,
      });
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

  // Aplicar filtros con conexión al backend
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
        page: 1,
        size: productPaginationMeta?.per_page || 9,
      };

      // Determinar filtro principal para el backend
      let hasBackendFilter = false;

      if (selectedCategories.length > 0) {
        searchParams.field = 'category_id';
        searchParams.value = selectedCategories[0].toString();
        searchParams.operator = '=';
        hasBackendFilter = true;
      } else if (selectedBrands.length > 0) {
        searchParams.field = 'brand_id';
        searchParams.value = selectedBrands[0].toString();
        searchParams.operator = '=';
        hasBackendFilter = true;
      }

      let response;
      if (hasBackendFilter) {
        response = await fetchSearchProductsByFilters(searchParams);
      } else {
        const { fetchProducts } = get();
        await fetchProducts(1, searchParams.size);
        set({ isLoadingProducts: false });
        return;
      }

      if (response.ok && response.data) {
        let filteredProducts = response.data.data;

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

        // Filtrar por favoritos
        if (selectedFavorites.length > 0) {
          filteredProducts = filteredProducts.filter(
            (product: Product) =>
              product.is_favorite && selectedFavorites.includes(product.id)
          );
        }

        // Filtrar por precio del lado cliente
        const hasPriceFilter = lowerPrice > minPrice || upperPrice < maxPrice;
        if (hasPriceFilter) {
          filteredProducts = filteredProducts.filter((product: Product) => {
            let price = product.price;
            if (typeof price === 'string') {
              price = parseFloat(
                (price as string).replace(/[^\d.,]/g, '').replace(',', '.')
              );
            }
            return price >= lowerPrice && price <= upperPrice;
          });
        }

        // Actualizar rango de precios basado en productos filtrados
        initializePriceRange(filteredProducts);

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
    });

    // Recargar productos originales
    try {
      await fetchProducts(1, productPaginationMeta?.per_page || 9);
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
