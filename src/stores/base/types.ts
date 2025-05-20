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

// Tipo completo del store
export type Store = StoreState &
  ProductsSlice &
  CategoriesSlice &
  UiSlice &
  CartSlice &
  PaginationSlice;
