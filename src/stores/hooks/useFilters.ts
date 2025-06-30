import useStore from '../base';

// Hook para obtener categorías y marcas seleccionadas
export const useSelectedFilters = () =>
  useStore((state) => ({
    selectedCategories: state.selectedCategories,
    selectedBrands: state.selectedBrands,
    selectedFavorites: state.selectedFavorites,
  }));

// Hook para obtener rangos de precio
export const usePriceRange = () =>
  useStore((state) => ({
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    selectedMinPrice: state.selectedMinPrice,
    selectedMaxPrice: state.selectedMaxPrice,
    priceInitialized: state.priceInitialized,
  }));

// Hook para obtener estados de UI de filtros
export const useFilterUI = () =>
  useStore((state) => ({
    isMainCategoryOpen: state.isMainCategoryOpen,
    isBrandsOpen: state.isBrandsOpen,
    isFavoritesOpen: state.isFavoritesOpen,
    isPriceOpen: state.isPriceOpen,
  }));

// Hook para obtener acciones de filtros de categorías
export const useCategoryFilters = () =>
  useStore((state) => ({
    selectedCategories: state.selectedCategories,
    setSelectedCategories: state.setSelectedCategories,
    toggleCategorySelection: state.toggleCategorySelection,
  }));

// Hook para obtener acciones de filtros de marcas
export const useBrandFilters = () =>
  useStore((state) => ({
    selectedBrands: state.selectedBrands,
    setSelectedBrands: state.setSelectedBrands,
    toggleBrandSelection: state.toggleBrandSelection,
  }));

// Hook para obtener acciones de filtros de precio
export const usePriceFilters = () => {
  const priceRange = usePriceRange();

  return useStore((state) => ({
    ...priceRange,
    setSelectedPriceRange: state.setSelectedPriceRange,
    setSelectedMinPrice: state.setSelectedMinPrice,
    setSelectedMaxPrice: state.setSelectedMaxPrice,
    handlePriceRangeChange: state.handlePriceRangeChange,
  }));
};

// Hook para obtener acciones de UI de filtros
export const useFilterUIActions = () =>
  useStore((state) => ({
    setMainCategoryOpen: state.setMainCategoryOpen,
    setBrandsOpen: state.setBrandsOpen,
    setFavoritesOpen: state.setFavoritesOpen,
    setPriceOpen: state.setPriceOpen,
    toggleMainCategory: state.toggleMainCategory,
    toggleBrandsSection: state.toggleBrandsSection,
    toggleFavoritesSection: state.toggleFavoritesSection,
    togglePriceSection: state.togglePriceSection,
  }));

// Hook para obtener acciones principales de filtros
export const useFilterActions = () =>
  useStore((state) => ({
    applyFilters: state.applyFilters,
    clearAllFilters: state.clearAllFilters,
    resetFiltersState: state.resetFiltersState,
    hasActiveFilters: state.hasActiveFilters,
    filterProductsByBrands: state.filterProductsByBrands,
  }));

// Hook combinado para componentes de filtros
export const useFilters = () => {
  const selectedFilters = useSelectedFilters();
  const priceRange = usePriceRange();
  const filterUI = useFilterUI();
  const categoryActions = useCategoryFilters();
  const brandActions = useBrandFilters();
  const priceActions = usePriceFilters();
  const uiActions = useFilterUIActions();
  const mainActions = useFilterActions();

  return {
    // Estados
    ...selectedFilters,
    ...priceRange,
    ...filterUI,

    // Acciones por categoría
    categoryActions,
    brandActions,
    priceActions,
    uiActions,
    mainActions,
  };
};
