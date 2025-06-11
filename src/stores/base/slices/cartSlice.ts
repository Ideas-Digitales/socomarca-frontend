import { StateCreator } from 'zustand';
import { CartSlice, StoreState } from '../types';
import {
  fetchDeleteCartItem,
  fetchGetCart,
  fetchPostAddToCart,
} from '@/services/actions/cart.actions';
import { CartItem } from '@/interfaces/product.interface';

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

      if (response.ok && response.data) {
        await get().fetchCartProducts();
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
        };
      }
    } catch (error) {
      console.error('Error in addProductToCart:', error);

      return {
        ok: false,
      };
    } finally {
      set({
        isCartLoading: false,
      });
    }
  },

  fetchCartProducts: async () => {
    set({
      isCartLoading: true,
    });
    try {
      const response = await fetchGetCart();

      if (response.ok && response.data) {
        set({
          cartProducts: response.data.items,
        });
      } else {
        set({
          cartProducts: [],
        });
      }
    } catch (error) {
      console.error('Error in getCartProducts:', error);
      set({
        cartProducts: [],
      });
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

  removeProductFromCart: async (product: CartItem) => {
    try {
      set({
        isCartLoading: true,
      });
      const response = await fetchDeleteCartItem(product.id, 1, product.unit);
      if (response.ok && response.data) {
        await get().fetchCartProducts();
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
        };
      }
    } catch (error) {
      console.error('Error in removeProductFromCart:', error);
      return {
        ok: false,
      };
    } finally {
      set({
        isCartLoading: false,
      });
    }
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
