import { StateCreator } from 'zustand';
import { FiltersSlice, StoreState, ProductsSlice } from '../types';
import { Product } from '@/interfaces/product.interface';

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

  initializePriceRange: (products) => {
    const { priceInitialized } = get();

    if (products && products.length > 0 && !priceInitialized) {
      const validPrices = products
        .map((product) => product.price || 0)
        .filter((price) => !isNaN(price) && price >= 0);

      if (validPrices.length > 0) {
        const min = Math.floor(Math.min(...validPrices));
        let max = Math.ceil(Math.max(...validPrices));

        if (min === max) {
          max = min + 1;
        }

        set({
          minPrice: min,
          maxPrice: max,
          lowerPrice: min,
          upperPrice: max,
          priceInitialized: true,
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

  // Aplicar todos los filtros
  applyFilters: () => {
    const {
      products,
      selectedCategories,
      selectedBrands,
      selectedFavorites,
      lowerPrice,
      upperPrice,
      setFilteredProducts,
    } = get();

    let filteredResults: Product[] = [...products];

    // Aplicar filtro de categorías
    if (selectedCategories.length > 0) {
      filteredResults = filteredResults.filter((product) =>
        selectedCategories.includes(product.category.id)
      );
    }

    // Aplicar filtro de marcas
    if (selectedBrands.length > 0) {
      filteredResults = filteredResults.filter(
        (product) => product.brand && selectedBrands.includes(product.brand.id)
      );
    }

    if (selectedFavorites.length > 0) {
      filteredResults = filteredResults.filter((product) =>
        selectedFavorites.includes(product.id)
      );
    }

    // Aplicar filtro de precio
    filteredResults = filteredResults.filter((product) => {
      const price = product.price || 0;
      return price >= lowerPrice && price <= upperPrice;
    });

    setFilteredProducts(filteredResults);
  },

  // Limpiar todos los filtros
  clearAllFilters: () => {
    const { minPrice, maxPrice } = get();
    set({
      selectedCategories: [],
      selectedBrands: [],
      selectedFavorites: [],
      lowerPrice: minPrice,
      upperPrice: maxPrice,
    });
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
