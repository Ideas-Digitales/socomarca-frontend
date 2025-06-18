import {
  CartItem,
  Product,
  SearchWithPaginationProps,
} from '@/interfaces/product.interface';
import { Category } from '@/interfaces/category.interface';
import { Brand } from '@/interfaces/brand.interface';
import { SidebarConfig } from '@/interfaces/sidebar.interface';
import { FavoriteList } from '@/interfaces/favorite.inteface';

// Tipos para el modal
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalContentType = 'confirm' | 'info' | 'form' | 'custom' | null;

export interface ModalSlice {
  // Estados
  isModalOpen: boolean;
  modalTitle: string;
  modalSize: ModalSize;
  modalContent: React.ReactNode;

  // Acciones
  openModal: (
    content?: string,
    options?: {
      title?: string;
      size?: ModalSize;
      showCloseButton?: boolean;
      content?: React.ReactNode;
    }
  ) => void;
  closeModal: () => void;
}

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

  // Filtrar productos por marcas
  filterProductsByBrands: () => void;
}

// Estado base del store
export interface StoreState {
  // Productos
  products: Product[];
  isLoadingProducts: boolean;
  filteredProducts: Product[];
  searchTerm: string;

  // Categorías
  categories: Category[];

  // Marcas
  brands: Brand[];

  // Favoritos
  favoriteLists: FavoriteList[];
  selectedFavoriteList: any | null;
  isLoadingFavorites: boolean;
  showOnlyFavorites: boolean;

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
  cartProducts: CartItem[];
  isCartLoading: boolean;

  // Paginación
  productPaginationMeta: PaginationMeta | null;
  productPaginationLinks: PaginationLinks | null;
  currentPage: number;

  // Sidebar Navigation
  activeItem: ActiveItem | null;
  openSubmenus: number[];
  isMobileSidebarOpen: boolean;

  // Estados del modal
  isModalOpen: boolean;
  modalTitle: string;
  modalSize: ModalSize;
  modalContent: React.ReactNode;
}

// Acciones de productos
export interface ProductsSlice {
  setProducts: (
    products: Product[],
    meta?: PaginationMeta,
    links?: PaginationLinks
  ) => void;
  setSearchTerm: (terms: SearchWithPaginationProps) => void;
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
  addProductToCart: (
    product_id: number,
    quantity: number,
    unit: string
  ) => Promise<{ ok: boolean }>;
  incrementProductInCart: (productId: number) => void;
  decrementProductInCart: (productId: number) => void;
  removeAllQuantityByProductId: (productId: number) => void;
  clearCart: () => void;
  fetchCartProducts: () => Promise<void>;
  removeProductFromCart: (product: CartItem, quantity: number) => Promise<{ ok: boolean }>;
}

// Acciones de paginación
export interface PaginationSlice {
  setProductPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export interface SidebarSlice {
  // Estados
  activeItem: ActiveItem | null;
  openSubmenus: number[];
  isMobileSidebarOpen: boolean;
  currentSidebarConfig: SidebarConfig | null;

  // Acciones básicas
  setActiveItem: (item: ActiveItem | null) => void;
  setSidebarConfig: (config: SidebarConfig) => void;
  toggleSubmenu: (menuIndex: number) => void;
  closeAllSubmenus: () => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  closeMobileSidebar: () => void;
  setActiveItemByUrl: (currentPath: string) => void;

  // Helpers
  isMenuActive: (menuIndex: number) => boolean;
  isSubmenuActive: (menuIndex: number, submenuIndex: number) => boolean;
  isSubmenuOpen: (menuIndex: number) => boolean;

  // Acciones compuestas
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
  StoreSlice &
  ModalSlice &
  FavoritesSlice;

export interface FavoritesSlice {
  // Estados
  favoriteLists: FavoriteList[];
  selectedFavoriteList: any | null;
  isLoadingFavorites: boolean;
  showOnlyFavorites: boolean;

  // Acciones
  fetchFavorites: () => Promise<void>;
  createFavoriteList: (name: string) => Promise<{ ok: boolean; error?: string }>;
  addProductToFavoriteList: (favoriteListId: number, productId: number) => Promise<{ ok: boolean; error?: string }>;
  removeProductFromFavorites: (productId: number) => Promise<{ ok: boolean; error?: string }>;
  setSelectedFavoriteList: (list: any | null) => void;
  setShowOnlyFavorites: (show: boolean) => void;
  toggleShowOnlyFavorites: () => void;
  getFavoriteProductIds: () => number[];
  resetFavoritesState: () => void;
}
