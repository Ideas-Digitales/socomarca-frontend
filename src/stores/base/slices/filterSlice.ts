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
    console.log('🏪 Setting available price range from backend:', { min, max });

    set({
      minPrice: min,
      maxPrice: max,

      selectedMinPrice: min,
      selectedMaxPrice: max,

      priceInitialized: true,
    });
  },

  setSelectedPriceRange: (selectedMin, selectedMax) => {
    const { minPrice, maxPrice } = get();

    const boundedMin = Math.max(minPrice, Math.min(selectedMin, maxPrice));
    const boundedMax = Math.min(maxPrice, Math.max(selectedMax, minPrice));

    set({
      selectedMinPrice: boundedMin,
      selectedMaxPrice: boundedMax,
    });
  },

  setSelectedMinPrice: (price) => {
    const { minPrice, selectedMaxPrice } = get();
    const boundedPrice = Math.max(minPrice, Math.min(price, selectedMaxPrice));

    set({
      selectedMinPrice: boundedPrice,
    });
  },

  setSelectedMaxPrice: (price) => {
    const { maxPrice, selectedMinPrice } = get();
    const boundedPrice = Math.min(maxPrice, Math.max(price, selectedMinPrice));

    set({
      selectedMaxPrice: boundedPrice,
    });
  },

  handlePriceRangeChange: (lower, upper) => {
    const { setSelectedPriceRange } = get();
    setSelectedPriceRange(lower, upper);
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
      selectedFavorites,
      selectedMinPrice,
      selectedMaxPrice,
      productPaginationMeta,
    } = get();

    try {
      set({ isLoadingProducts: true });

      const searchParams: SearchWithPaginationProps = {
        page: 1,
        size: productPaginationMeta?.per_page || 9,
        min: selectedMinPrice,
        max: selectedMaxPrice,
      };

      if (selectedCategories.length > 0) {
        searchParams.field = 'name' as const;
        searchParams.value = selectedCategories[0].toString();
      }

      if (selectedBrands.length > 0) {
        searchParams.field = 'name' as const;
        searchParams.value = selectedBrands[0].toString();
      }

      const response = await fetchSearchProductsByFilters(searchParams);

      if (response.ok && response.data) {
        let filteredProducts = response.data.data;

        if (selectedCategories.length > 1) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            selectedCategories.includes(product.category.id)
          );
        }

        if (selectedBrands.length > 1) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            selectedBrands.includes(product.brand.id)
          );
        }

        if (selectedFavorites.length > 0) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            selectedFavorites.includes(product.id)
          );
        }

        const { setFilteredProducts } = get();
        setFilteredProducts(filteredProducts);

        set({ isLoadingProducts: false, isFiltered: true });
      } else {
        console.error('Error applying filters:', response.error);
        set({ isLoadingProducts: false });
      }
    } catch (error) {
      console.error('Error in applyFilters:', error);
      set({ isLoadingProducts: false });
    }
  },

  clearAllFilters: async () => {
    const { fetchProducts, productPaginationMeta, minPrice, maxPrice } = get();

    set({
      selectedCategories: [],
      selectedBrands: [],
      selectedFavorites: [],
      searchTerm: '',
      showOnlyFavorites: false,
      selectedMinPrice: minPrice,
      selectedMaxPrice: maxPrice,
      isFiltered: false,
    });

    console.log('isFiltered state after clearing:', get().isFiltered);

    try {
      await fetchProducts(1, productPaginationMeta?.per_page || 9);
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
