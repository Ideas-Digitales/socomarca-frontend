import { Product, ProductToBuy } from '@/interfaces/product.interface';
import { Category } from '@/interfaces/category.interface';

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

// Estado base del store
export interface StoreState {
  // Productos
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;

  // Categorías
  categories: Category[];

  // UI
  isLoading: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isQaMode: boolean;
  viewMode: 'grid' | 'list';

  // Carrito
  cartProducts: ProductToBuy[];

  // Paginación
  paginationMeta: PaginationMeta | null;
  paginationLinks: PaginationLinks | null;
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
  setPage: (page: number) => void;
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
  UiSlice &
  CartSlice &
  PaginationSlice &
  SidebarSlice;
