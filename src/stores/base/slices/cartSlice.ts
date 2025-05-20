import { Product } from '@/interfaces/product.interface';
import { StateCreator } from 'zustand';
import { CartSlice, StoreState } from '../types';

export const createCartSlice: StateCreator<
  StoreState & CartSlice,
  [],
  [],
  CartSlice
> = (set, get) => ({
  addProductToCart: (product: Product, quantity) => {
    const { cartProducts } = get();
    const existingProduct = cartProducts.find((item) => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cartProducts.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      set({ cartProducts: updatedCart });
    } else {
      const newProduct = { ...product, quantity };
      set({ cartProducts: [...cartProducts, newProduct] });
    }
  },

  incrementProductInCart: (productId: number) => {
    const { cartProducts } = get();
    const updatedCart = cartProducts.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    set({ cartProducts: updatedCart });
  },

  decrementProductInCart: (productId: number) => {
    const { cartProducts } = get();
    const updatedCart = cartProducts.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    set({ cartProducts: updatedCart });
  },

  removeProductFromCart: (productId: number) => {
    const { cartProducts } = get();
    const updatedCart = cartProducts.reduce<typeof cartProducts>(
      (acc, item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push({ ...item });
        }
        return acc;
      },
      []
    );
    set({ cartProducts: updatedCart });
  },

  removeAllQuantityByProductId: (productId: number) => {
    const { cartProducts } = get();
    const updatedCart = cartProducts.filter((item) => item.id !== productId);
    set({ cartProducts: updatedCart });
  },

  clearCart: () => {
    set({ cartProducts: [] });
  },
});
