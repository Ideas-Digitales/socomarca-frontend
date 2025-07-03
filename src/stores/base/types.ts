import {
  CartItem,
  Product,
  SearchWithPaginationProps,
} from '@/interfaces/product.interface';
import { Category, CategoryComplexData } from '@/interfaces/category.interface';
import { Brand } from '@/interfaces/brand.interface';
import { SidebarConfig } from '@/interfaces/sidebar.interface';
import { FavoriteList } from '@/interfaces/favorite.inteface';
import { ReportsSlice, TableDetail, ReportsFilters } from './slices/reportsSlice';

// ===== BASE TYPES =====
export type ViewMode = 'grid' | 'list';
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalContentType = 'confirm' | 'info' | 'form' | 'custom' | null;

// ===== USER & AUTH TYPES =====
export interface User {
  id: number;
  name: string;
  email: string;
  rut: string;
  roles: string[];
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User;
  token: string;
  isLoading: boolean;
  isInitialized: boolean;
}

// ===== PAGINATION TYPES =====
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

// ===== SIDEBAR TYPES =====
export interface ActiveItem {
  type: 'menu' | 'submenu';
  menuIndex: number;
  submenuIndex?: number;
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}

// ===== LOADING STATES =====
export interface LoadingStates {
  isLoading: boolean;
  isLoadingProducts: boolean;
  isCartLoading: boolean;
  isLoadingFavorites: boolean;
}

// ===== SLICE INTERFACES =====

// Auth Slice
export interface AuthSlice extends AuthState {
  login: (credentials: {
    rut: string;
    password: string;
    role?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  initializeFromAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  getUserRole: () => string | null;
}

// Modal Slice
export interface ModalSlice {
  isModalOpen: boolean;
  modalTitle: string;
  modalSize: ModalSize;
  modalContent: React.ReactNode;

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
  updateModalContent: (content: React.ReactNode) => void;
}

// Products Slice
export interface ProductsSlice {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  productPaginationMeta: PaginationMeta | null;
  productPaginationLinks: PaginationLinks | null;
  currentPage: number;

  setProducts: (
    products: Product[],
    meta?: PaginationMeta,
    links?: PaginationLinks
  ) => void;
  setFilteredProducts: (filteredProducts: Product[]) => void;
  setSearchTerm: (
    terms: SearchWithPaginationProps & { page?: number; size?: number }
  ) => Promise<void>;
  fetchProducts: (page?: number, size?: number) => Promise<void>;
  fetchMinMaxPrice: () => Promise<void>;
}

// Categories Slice
export interface CategoriesSlice {
  categories: CategoryComplexData[];

  setCategories: (categories: Category[]) => void;
  fetchCategories: () => Promise<void>;
}

// Brands Slice
export interface BrandsSlice {
  brands: Brand[];

  setBrands: (brands: Brand[]) => void;
  fetchBrands: () => Promise<void>;
}

// UI Slice
export interface UiSlice {
  isMobile: boolean;
  isTablet: boolean;
  viewMode: ViewMode;

  checkIsMobile: () => void;
  checkIsTablet: () => void;
  setViewMode: (mode: ViewMode) => void;
}

// Cart Slice
export interface CartSlice {
  cartProducts: CartItem[];

  addProductToCart: (
    product_id: number,
    quantity: number,
    unit: string
  ) => Promise<ApiResponse>;
  addProductToCartOptimistic: (
    product_id: number,
    quantity: number,
    unit: string,
    product: Product
  ) => Promise<ApiResponse>;
  fetchCartProducts: () => Promise<void>;
  incrementProductInCart: (productId: number) => void;
  decrementProductInCart: (productId: number) => void;
  removeProductFromCart: (
    product: CartItem,
    quantity: number
  ) => Promise<ApiResponse>;
  removeProductFromCartOptimistic: (
    product: CartItem,
    quantity: number
  ) => Promise<ApiResponse>;
  removeAllQuantityByProductId: (productId: number) => void;
  clearCart: () => Promise<void>;
}

// Pagination Slice
export interface PaginationSlice {
  setProductPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

// Favorites Slice
export interface FavoritesSlice {
  favoriteLists: FavoriteList[];
  selectedFavoriteList: FavoriteList | null;
  showOnlyFavorites: boolean;
  favoritesInitialized: boolean;

  fetchFavorites: () => Promise<void>;
  createFavoriteList: (name: string) => Promise<ApiResponse>;
  addProductToFavoriteList: (
    favoriteListId: number,
    productId: number,
    unit: string
  ) => Promise<ApiResponse>;
  removeProductFromFavorites: (favoriteId: number) => Promise<ApiResponse>;
  setShowOnlyFavorites: (show: boolean) => void;
  toggleShowOnlyFavorites: () => void;
  getFavoriteProductIds: () => number[];
  resetFavoritesState: () => void;
  setSelectedFavoriteList: (list: FavoriteList | null) => void;
  removeFavoriteList: (listId: number) => Promise<ApiResponse>;
  changeListName: (listId: number, newName: string) => Promise<ApiResponse>;
  toggleProductFavorite: (
    productId: number,
    product?: any
  ) => Promise<
    ApiResponse & { requiresListSelection?: boolean; product?: any }
  >;
}

// Filters Slice
export interface FiltersSlice {
  selectedCategories: number[];
  selectedBrands: number[];
  selectedFavorites: number[];
  minPrice: number;
  maxPrice: number;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  priceInitialized: boolean;

  isMainCategoryOpen: boolean;
  isBrandsOpen: boolean;
  isFavoritesOpen: boolean;
  isPriceOpen: boolean;
  isFiltered: boolean;
  
  setSelectedCategories: (categories: number[]) => void;
  toggleCategorySelection: (categoryId: number) => void;
  setSelectedBrands: (brands: number[]) => void;
  toggleBrandSelection: (brandId: number) => void;
  setSelectedFavorites: (favorites: number[]) => void;
  toggleFavoriteSelection: (favoriteId: number) => void;
  setAvailablePriceRange: (min: number, max: number) => void;
  setSelectedPriceRange: (selectedMin: number, selectedMax: number) => void;
  setSelectedMinPrice: (price: number) => void;
  setSelectedMaxPrice: (price: number) => void;
  handlePriceRangeChange: (lower: number, upper: number) => void;
  setMainCategoryOpen: (isOpen: boolean) => void;
  setBrandsOpen: (isOpen: boolean) => void;
  setFavoritesOpen: (isOpen: boolean) => void;
  setPriceOpen: (isOpen: boolean) => void;
  toggleMainCategory: () => void;
  toggleBrandsSection: () => void;
  toggleFavoritesSection: () => void;
  togglePriceSection: () => void;
  applyFilters: () => Promise<void>;
  clearAllFilters: () => Promise<void>;
  resetFiltersState: () => void;
  hasActiveFilters: () => boolean;
  filterProductsByBrands: () => void;
}

// Sidebar Slice
export interface SidebarSlice {
  activeItem: ActiveItem | null;
  openSubmenus: number[];
  isMobileSidebarOpen: boolean;
  currentSidebarConfig: SidebarConfig | null;

  setSidebarConfig: (config: SidebarConfig) => void;
  setActiveItem: (item: ActiveItem | null) => void;
  toggleSubmenu: (menuIndex: number) => void;
  closeAllSubmenus: () => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  closeMobileSidebar: () => void;
  setActiveItemByUrl: (currentPath: string) => void;

  isMenuActive: (menuIndex: number) => boolean;
  isSubmenuActive: (menuIndex: number, submenuIndex: number) => boolean;
  isSubmenuOpen: (menuIndex: number) => boolean;
  resetNavigation: () => void;

  handleMenuClick: (menuIndex: number, hasSubmenu: boolean) => void;
  handleSubmenuClick: (menuIndex: number, submenuIndex: number) => void;
}

// Store Management Slice
export interface StoreSlice {
  resetBrandsState: () => void;
  resetCategoriesState: () => void;
  resetProductsState: () => void;
  resetFiltersState: () => void;
  resetSearchRelatedStates: () => Promise<void>;
  resetAllStates: () => Promise<void>;
}

// ===== MAIN STORE STATE =====
export interface StoreState extends LoadingStates, AuthState {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  productPaginationMeta: PaginationMeta | null;
  productPaginationLinks: PaginationLinks | null;
  currentPage: number;

  categories: CategoryComplexData[];
  brands: Brand[];

  isMobile: boolean;
  isTablet: boolean;
  viewMode: ViewMode;

  cartProducts: CartItem[];

  favoriteLists: FavoriteList[];
  selectedFavoriteList: FavoriteList | null;
  showOnlyFavorites: boolean;
  favoritesInitialized: boolean;

  transactionsList: TableDetail[];
  selectedTransaction: TableDetail | null;
  uniqueClients: string[];
  reportsCurrentPage: number;
  reportsPagination: PaginationMeta | null;
  isLoadingReports: boolean;
  reportsFilters: ReportsFilters;
  lastApiParameters: any;

  selectedCategories: number[];
  selectedBrands: number[];
  selectedFavorites: number[];
  minPrice: number;
  maxPrice: number;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  priceInitialized: boolean;
  isMainCategoryOpen: boolean;
  isBrandsOpen: boolean;
  isFavoritesOpen: boolean;
  isPriceOpen: boolean;

  activeItem: ActiveItem | null;
  openSubmenus: number[];
  isMobileSidebarOpen: boolean;
  currentSidebarConfig: SidebarConfig | null;

  isModalOpen: boolean;
  modalTitle: string;
  modalSize: ModalSize;
  modalContent: React.ReactNode;
  isFiltered: boolean;

  isQaMode: boolean;
}

// ===== COMPLETE STORE TYPE =====
export type Store = StoreState &
  AuthSlice &
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
  FavoritesSlice &
  ReportsSlice;
