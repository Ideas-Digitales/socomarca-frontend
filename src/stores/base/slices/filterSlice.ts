import { StateCreator } from 'zustand';
import {
  FiltersSlice,
  StoreState,
  ProductsSlice,
  FavoritesSlice,
  StoreSlice,
  CategoriesSlice,
} from '../types';
import {
  Product,
  SearchWithPaginationProps,
} from '@/interfaces/product.interface';
import { CategoryComplexData } from '@/interfaces/category.interface';
import { fetchSearchProductsByFilters } from '@/services/actions/products.actions';

const findCategoryPath = (
  categories: CategoryComplexData[] | null,
  categoryId: number,
  path: CategoryComplexData[] = []
): CategoryComplexData[] | null => {
  for (const category of categories ?? []) {
    const nextPath = [...path, category];

    if (category.id === categoryId) {
      return nextPath;
    }

    const childPath = findCategoryPath(
      category.categories ?? category.subcategories ?? null,
      categoryId,
      nextPath
    );

    if (childPath) {
      return childPath;
    }
  }

  return null;
};

const getHierarchicalSelection = (
  categories: CategoryComplexData[],
  searchCategories: CategoryComplexData[] | null,
  categoryId: number
) => {
  const path =
    findCategoryPath(searchCategories, categoryId) ??
    findCategoryPath(categories, categoryId) ??
    [];
  const selectedSupercategoryId = path[0]?.id ?? null;
  const selectedCategoryId = path[1]?.id ?? null;
  const selectedSubcategoryId = path[2]?.id ?? null;

  return {
    selectedCategories: path.map((category) => category.id),
    selectedSupercategoryId,
    selectedCategoryId,
    selectedSubcategoryId,
  };
};

export const buildCategoryTreeFromSearchExtra = (
  extra: any,
  allCategories: CategoryComplexData[]
): CategoryComplexData[] | null => {
  const supercategoryIds = new Set<number>(
    (extra?.supercategories ?? []).map((category: CategoryComplexData) => category.id)
  );
  const categoryIds = new Set<number>(
    (extra?.categories ?? []).map((category: CategoryComplexData) => category.id)
  );
  const subcategoryIds = new Set<number>(
    (extra?.subcategories ?? []).map((category: CategoryComplexData) => category.id)
  );

  if (supercategoryIds.size === 0 && categoryIds.size === 0 && subcategoryIds.size === 0) {
    return null;
  }

  return allCategories.flatMap((supercategory) => {
    const categories = (supercategory.categories ?? []).flatMap((category) => {
      const subcategories = (category.subcategories ?? []).filter((subcategory) =>
        subcategoryIds.has(subcategory.id)
      );
      const shouldIncludeCategory = categoryIds.has(category.id) || subcategories.length > 0;

      return shouldIncludeCategory ? [{ ...category, subcategories }] : [];
    });
    const shouldIncludeSupercategory = supercategoryIds.has(supercategory.id) || categories.length > 0;

    return shouldIncludeSupercategory ? [{ ...supercategory, categories }] : [];
  });
};

export const addSelectedCategoryFilter = (
  searchParams: SearchWithPaginationProps,
  selectedSupercategoryId: number | null,
  selectedCategoryId: number | null,
  selectedSubcategoryId: number | null
) => {
  if (selectedSupercategoryId) {
    searchParams.supercategory_id = selectedSupercategoryId;
  }

  if (selectedCategoryId) {
    searchParams.category_id = selectedCategoryId;
  }

  if (selectedSubcategoryId) {
    searchParams.subcategory_id = selectedSubcategoryId;
  }
};

export const createFiltersSlice: StateCreator<
  StoreState & FiltersSlice & ProductsSlice & FavoritesSlice & StoreSlice & CategoriesSlice,
  [],
  [],
  FiltersSlice
> = (set, get) => ({
  selectedCategories: [],
  selectedSupercategoryId: null,
  selectedCategoryId: null,
  selectedSubcategoryId: null,
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
    const categoryId = categories[categories.length - 1];

    if (!categoryId) {
      set({
        selectedCategories: [],
        selectedSupercategoryId: null,
        selectedCategoryId: null,
        selectedSubcategoryId: null,
      });
      return;
    }

    const { categories: allCategories, searchCategories } = get();
    set(getHierarchicalSelection(allCategories, searchCategories, categoryId));
  },

  toggleCategorySelection: (categoryId) => {
    const { selectedCategories, categories, searchCategories } = get();

    if (selectedCategories.includes(categoryId)) {
      set({
        selectedCategories: [],
        selectedSupercategoryId: null,
        selectedCategoryId: null,
        selectedSubcategoryId: null,
      });
      return;
    }

    set(getHierarchicalSelection(categories, searchCategories, categoryId));
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
      selectedSupercategoryId,
      selectedCategoryId,
      selectedSubcategoryId,
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
      addSelectedCategoryFilter(
        searchParams,
        selectedSupercategoryId,
        selectedCategoryId,
        selectedSubcategoryId
      );

      // Agregar marcas si están seleccionadas
      if (selectedBrands.length > 0) {
        searchParams.brand_id = selectedBrands;
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
      resetSearchRelatedStates,
    } = get();

    set({
      selectedCategories: [],
      selectedSupercategoryId: null,
      selectedCategoryId: null,
      selectedSubcategoryId: null,
      selectedBrands: [],
      selectedFavorites: [],
      showOnlyFavorites: false,
      selectedMinPrice: minPrice,
      selectedMaxPrice: maxPrice,
      isFiltered: false,
      searchCategories: null,
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
      selectedSupercategoryId: null,
      selectedCategoryId: null,
      selectedSubcategoryId: null,
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
      searchCategories: null,
    });
  },

  hasActiveFilters: () => {
    const {
      selectedCategories,
      selectedSupercategoryId,
      selectedCategoryId,
      selectedSubcategoryId,
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
      selectedSupercategoryId !== null ||
      selectedCategoryId !== null ||
      selectedSubcategoryId !== null ||
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
      product.brand != null && selectedBrands.includes(product.brand.id)
    );

    set({ filteredProducts });
  },
});
