import { Product, ProductToBuy } from '@/interfaces/product.interface';
import { Category } from '@/interfaces/category.interface';
import { Brand } from '@/interfaces/brand.interface';
export interface StoreSlice {
  // Métodos individuales de reset
  resetBrandsState: () => void;
  resetCategoriesState: () => void;
  resetProductsState: () => void;
  resetFiltersState: () => void;
  // Métodos combinados de reset
  resetSearchRelatedStates: () => void;
  resetAllStates: () => void;
}
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Tipos para el sidebar navigation
export interface ActiveItem {
  type: 'menu' | 'submenu';
  menuIndex: number;
  submenuIndex?: number;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface FiltersSlice {
  // Estados de filtros (ya están en StoreState)

  // Acciones para categorías
  setSelectedCategories: (categories: number[]) => void;
  toggleCategorySelection: (categoryId: number) => void;

  // Acciones para marcas
  setSelectedBrands: (brands: number[]) => void;
  toggleBrandSelection: (brandId: number) => void;

  // Acciones para favoritos
  setSelectedFavorites: (favorites: number[]) => void;
  toggleFavoriteSelection: (favoriteId: number) => void;

  // Acciones para precios
  setPriceRange: (
    min: number,
    max: number,
    lower: number,
    upper: number
  ) => void;
  setLowerPrice: (price: number) => void;
  setUpperPrice: (price: number) => void;
  handlePriceRangeChange: (lower: number, upper: number) => void;
  initializePriceRange: (products: Product[]) => void;

  // Acciones para UI de filtros
  setMainCategoryOpen: (isOpen: boolean) => void;
  setBrandsOpen: (isOpen: boolean) => void;
  setFavoritesOpen: (isOpen: boolean) => void;
  setPriceOpen: (isOpen: boolean) => void;
  toggleMainCategory: () => void;
  toggleBrandsSection: () => void;
  toggleFavoritesSection: () => void;
  togglePriceSection: () => void;

  // Acciones principales
  applyFilters: () => void;
  clearAllFilters: () => void;
  resetFiltersState: () => void;
  hasActiveFilters: () => boolean;
}

// Estado base del store
export interface StoreState {
  // Productos
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;

  // Categorías
  categories: Category[];

  // Marcas
  brands: Brand[];
  // Estados de filtros
  selectedCategories: number[];
  selectedBrands: number[];
  selectedFavorites: number[];
  minPrice: number;
  maxPrice: number;
  lowerPrice: number;
  upperPrice: number;
  priceInitialized: boolean;

  // Estados de UI de filtros
  isMainCategoryOpen: boolean;
  isBrandsOpen: boolean;
  isFavoritesOpen: boolean;
  isPriceOpen: boolean;
  // UI
  isLoading: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isQaMode: boolean;
  viewMode: 'grid' | 'list';

  // Carrito
  cartProducts: ProductToBuy[];

  // Paginación
  productPaginationMeta: PaginationMeta | null;
  productPaginationLinks: PaginationLinks | null;
  currentPage: number;

  // Sidebar Navigation
  activeItem: ActiveItem | null;
  openSubmenus: number[];
  isMobileSidebarOpen: boolean;
}

// Acciones de productos
export interface ProductsSlice {
  setProducts: (
    products: Product[],
    meta?: PaginationMeta,
    links?: PaginationLinks
  ) => void;
  setSearchTerm: (term: string) => void;
  fetchProducts: (page?: number, size?: number) => Promise<void>;
  setFilteredProducts: (filteredProducts: Product[]) => void;
}

// Acciones de categorías
export interface CategoriesSlice {
  setCategories: (categories: Category[]) => void;
  fetchCategories: () => Promise<void>;
}

// Acciones de marcas
export interface BrandsSlice {
  // ← Nueva interfaz
  setBrands: (brands: Brand[]) => void;
  fetchBrands: () => Promise<void>;
}

// Acciones de UI
export interface UiSlice {
  checkIsMobile: () => void;
  checkIsTablet: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

// Acciones de carrito
export interface CartSlice {
  addProductToCart: (product: Product, quantity: number) => void;
  incrementProductInCart: (productId: number) => void;
  decrementProductInCart: (productId: number) => void;
  removeProductFromCart: (productId: number) => void;
  removeAllQuantityByProductId: (productId: number) => void;
  clearCart: () => void;
}

// Acciones de paginación
export interface PaginationSlice {
  setProductPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export interface SidebarSlice {
  //Actions
  setActiveItem: (item: ActiveItem | null) => void;
  toggleSubmenu: (menuIndex: number) => void;
  closeAllSubmenus: () => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  closeMobileSidebar: () => void;
  setActiveItemByUrl: (currentPath: string) => void; // Nueva función

  // Helpers
  isMenuActive: (menuIndex: number) => boolean;
  isSubmenuActive: (menuIndex: number, submenuIndex: number) => boolean;
  isSubmenuOpen: (menuIndex: number) => boolean;

  // Complex Actions
  handleMenuClick: (menuIndex: number, hasSubmenu: boolean) => void;
  handleSubmenuClick: (menuIndex: number, submenuIndex: number) => void;
  resetNavigation: () => void;
}

// Tipo completo del store
export type Store = StoreState &
  ProductsSlice &
  CategoriesSlice &
  BrandsSlice &
  FiltersSlice &
  UiSlice &
  CartSlice &
  PaginationSlice &
  SidebarSlice &
  StoreSlice;
