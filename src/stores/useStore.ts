import { Product } from '@/interfaces/product.interface';
import { fetchGetProducts } from '@/services/actions/products.actions';
import { create } from 'zustand';

interface StoreState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  searchTerm: string;
  setProducts: (products: Product[]) => void;
  setSearchTerm: (term: string) => void;
  fetchProducts: () => Promise<void>;
}

const useStore = create<StoreState>((set, get) => ({
  isLoading: false,
  products: [],
  filteredProducts: [],
  searchTerm: '',
  setProducts: (products: Product[]) => {
    set({
      products,
      filteredProducts: get().searchTerm
        ? products.filter((product) =>
            product.name.toLowerCase().includes(get().searchTerm.toLowerCase())
          )
        : products,
    });
  },
  setSearchTerm: (term: string) => {
    const { products } = get();
    set({
      searchTerm: term,
      filteredProducts: term
        ? products.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
          )
        : products,
    });
  },
  fetchProducts: async () => {
    try {
      set({ isLoading: true });
      const { data } = await fetchGetProducts();

      if (Array.isArray(data)) {
        set({
          products: data,
          filteredProducts: data, // Todos los productos
          isLoading: false,
        });
      } else {
        console.error('La respuesta no contiene un array de productos:', data);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
    }
  },
}));

export default useStore;
