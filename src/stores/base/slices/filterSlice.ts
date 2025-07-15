import { StateCreator } from 'zustand';
import {
  FiltersSlice,
  StoreState,
  ProductsSlice,
  FavoritesSlice,
  StoreSlice,
} from '../types';
import {
  Product,
  SearchWithPaginationProps,
} from '@/interfaces/product.interface';
import { fetchSearchProductsByFilters } from '@/services/actions/products.actions';

export const createFiltersSlice: StateCreator<
  StoreState & FiltersSlice & ProductsSlice & FavoritesSlice & StoreSlice,
  [],
  [],
  FiltersSlice
> = (set, get) => ({
  selectedCategories: [],
  selectedBrands: [],
  selectedFavorites: [],
  minPrice: 0,
  maxPrice: 0,
  isFiltered: false,

  selectedMinPrice: 0,
  selectedMaxPrice: 0,

  priceInitialized: false,

  isMainCategoryOpen: true,
  isBrandsOpen: false,
  isFavoritesOpen: false,
  isPriceOpen: true,

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

  setAvailablePriceRange: (min, max) => {
    set({
      minPrice: min,
      maxPrice: max,
      selectedMinPrice: min,
      selectedMaxPrice: max,
      priceInitialized: true,
    });
  },

  setSelectedPriceRange: (selectedMin, selectedMax) => {
    set({
      selectedMinPrice: selectedMin,
      selectedMaxPrice: selectedMax,
    });
  },

  setSelectedMinPrice: (price) => {
    set({ selectedMinPrice: price });
  },

  setSelectedMaxPrice: (price) => {
    set({ selectedMaxPrice: price });
  },

  handlePriceRangeChange: (lower, upper) => {
    set({
      selectedMinPrice: lower,
      selectedMaxPrice: upper,
    });
  },

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

  applyFilters: async () => {
    const {
      selectedCategories,
      selectedBrands,
      //    selectedFavorites,
      selectedMinPrice,
      selectedMaxPrice,
      productPaginationMeta,
      searchTerm,
      showOnlyFavorites,
    } = get();

    try {
      set({ isLoadingProducts: true });

      const searchParams: SearchWithPaginationProps = {
        page: 1,
        size: productPaginationMeta?.per_page || 9,
        min: selectedMinPrice,
        max: selectedMaxPrice,
      };

      // Mantener el término de búsqueda si existe
      if (searchTerm) {
        searchParams.field = 'name';
        searchParams.value = searchTerm;
      }

      // Agregar categorías si están seleccionadas
      if (selectedCategories.length > 0) {
        searchParams.category_id = selectedCategories[0];
      }

      // Agregar marcas si están seleccionadas
      if (selectedBrands.length > 0) {
        searchParams.brand_id = selectedBrands[0];
      }

      // Agregar filtro de favoritos si está activado
      if (showOnlyFavorites) {
        searchParams.is_favorite = true;
      }

      const response = await fetchSearchProductsByFilters(searchParams);

      if (response.ok && response.data) {
        set({
          filteredProducts: response.data.data,
          productPaginationMeta: response.data.meta,
          productPaginationLinks: response.data.links,
          currentPage: response.data.meta.current_page,
          isLoadingProducts: false,
          isFiltered: true,
        });
      } else {
        console.error('Error en la respuesta del servidor:', response.error);
        set({ isLoadingProducts: false });
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      set({ isLoadingProducts: false });
    }
  },

  clearAllFilters: async () => {
    const { 
      // fetchProducts, 
      // productPaginationMeta, 
      minPrice, 
      maxPrice,
      resetSearchRelatedStates
    } = get();

    set({
      selectedCategories: [],
      selectedBrands: [],
      selectedFavorites: [],
      showOnlyFavorites: false,
      selectedMinPrice: minPrice,
      selectedMaxPrice: maxPrice,
      isFiltered: false,
    });

    try {
      // Limpiar búsqueda y recargar productos
      await resetSearchRelatedStates();
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  },

  resetFiltersState: () => {
    set({
      selectedCategories: [],
      selectedBrands: [],
      selectedFavorites: [],
      minPrice: 0,
      maxPrice: 0,
      selectedMinPrice: 0,
      selectedMaxPrice: 0,
      priceInitialized: false,
      searchTerm: '',
      showOnlyFavorites: false,
      isMainCategoryOpen: true,
      isBrandsOpen: false,
      isFavoritesOpen: false,
      isPriceOpen: true,
      isFiltered: false,
    });
  },

  hasActiveFilters: () => {
    const {
      selectedCategories,
      selectedBrands,
      selectedFavorites,
      selectedMinPrice,
      selectedMaxPrice,
      minPrice,
      maxPrice,
      searchTerm,
      showOnlyFavorites,
    } = get();

    return (
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      selectedFavorites.length > 0 ||
      selectedMinPrice > minPrice ||
      selectedMaxPrice < maxPrice ||
      searchTerm.length > 0 ||
      showOnlyFavorites
    );
  },

  filterProductsByBrands: () => {
    const { products, selectedBrands } = get();
    if (selectedBrands.length === 0) return products;

    const filteredProducts = products.filter((product: Product) =>
      selectedBrands.includes(product.brand.id)
    );

    set({ filteredProducts });
  },
});
