import { Product } from '@/interfaces/product.interface';
import { fetchGetProducts } from '@/services/actions/products.actions';
import { create } from 'zustand';

interface StoreState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  searchTerm: string;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchTerm: (term: string) => void;
  fetchProducts: () => Promise<void>;
}

const useStore = create<StoreState>((set, get) => ({
  isLoading: false,
  products: [],
  filteredProducts: [],
  searchTerm: '',
  setProducts: (products: Product[]) => set({ products }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
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
      set({ products: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
    }
  },
}));

export default useStore;
