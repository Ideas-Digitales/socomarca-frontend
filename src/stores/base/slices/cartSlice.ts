import { StateCreator } from 'zustand';
import { CartSlice, StoreState } from '../types';
import { fetchPostAddToCart } from '@/services/actions/cart.actions';

export const createCartSlice: StateCreator<
  StoreState & CartSlice,
  [],
  [],
  CartSlice
> = (set, get) => ({
  addProductToCart: async (
    product_id: number,
    quantity: number,
    unit: string
  ) => {
    try {
      set({
        isCartLoading: true,
      });
      const response = await fetchPostAddToCart({
        product_id,
        quantity,
        unit,
      });
      console.log('Response from addProductToCart:', response);

      if (response.ok && response.data) {
        set({
          cartProducts: response.data.items,
        });
        return {
          ok: true,
        };
      } else {
        console.error('Error adding product to cart:', response.error);
        return {
          ok: false,
        };
      }
    } catch (error) {
      set({
        cartProducts: [],
      });
      return {
        ok: false,
      };
      console.error('Error in addProductToCart:', error);
    } finally {
      set({
        isCartLoading: false,
      });
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
