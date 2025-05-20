import { Product, ProductToBuy } from '@/interfaces/product.interface';
import { Category } from '@/interfaces/category.interface';

export interface PaginationMeta {
  total_items: number;
  page_size: number;
  current_page: number;
  total_pages: number;
  links: {
    self: string | null;
    prev: string | null;
    next: string | null;
  };
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

  // Carrito
  cartProducts: ProductToBuy[];

  // Paginación
  paginationMeta: PaginationMeta | null;
  currentPage: number;
}

// Acciones de productos
export interface ProductsSlice {
  setProducts: (products: Product[], meta?: PaginationMeta) => void;
  setSearchTerm: (term: string) => void;
  fetchProducts: (page?: number, size?: number) => Promise<void>;
}

// Acciones de categorías
export interface CategoriesSlice {
  fetchCategories: () => Promise<void>;
}

// Acciones de UI
export interface UiSlice {
  checkIsMobile: () => void;
  checkIsTablet: () => void;
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
