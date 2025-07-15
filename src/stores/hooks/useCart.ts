import useStore from '../base';
import { useMemo } from 'react';

// Hook para obtener solo los productos del carrito
export const useCartProducts = () => useStore((state) => state.cartProducts);

// Hook para obtener el estado de carga del carrito
export const useCartLoading = () => useStore((state) => state.isCartLoading);

// Hook para obtener información calculada del carrito
export const useCartInfo = () =>
  useStore((state) => {
    const cartProducts = state.cartProducts;
    const totalItems = cartProducts.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalPrice = cartProducts.reduce(
      (sum, item) => sum + (item.subtotal || item.price * item.quantity),
      0
    );

    return {
      cartProducts,
      totalItems,
      totalPrice,
      isEmpty: cartProducts.length === 0,
      isLoading: state.isCartLoading,
    };
  });

// Hook para obtener solo las acciones del carrito
export const useCartActions = () => {
  const store = useStore();
  
  return useMemo(() => ({
    addProductToCart: store.addProductToCart,
    addProductToCartOptimistic: store.addProductToCartOptimistic,
    removeProductFromCart: store.removeProductFromCart,
    removeProductFromCartOptimistic: store.removeProductFromCartOptimistic,
    incrementProductInCart: store.incrementProductInCart,
    decrementProductInCart: store.decrementProductInCart,
    removeAllQuantityByProductId: store.removeAllQuantityByProductId,
    clearCart: store.clearCart,
    fetchCartProducts: store.fetchCartProducts,
  }), [
    store.addProductToCart,
    store.addProductToCartOptimistic,
    store.removeProductFromCart,
    store.removeProductFromCartOptimistic,
    store.incrementProductInCart,
    store.decrementProductInCart,
    store.removeAllQuantityByProductId,
    store.clearCart,
    store.fetchCartProducts,
  ]);
};

// Hook combinado para componentes que necesitan todo del carrito
export const useCart = () => {
  const cartInfo = useCartInfo();
  const actions = useCartActions();

  return {
    ...cartInfo,
    ...actions,
  };
};

// Hook para verificar si un producto específico está en el carrito
export const useIsProductInCart = (productId: number) =>
  useStore((state) => state.cartProducts.some((item) => item.id === productId));

// Hook para obtener la cantidad de un producto específico en el carrito
export const useProductCartQuantity = (productId: number) =>
  useStore((state) => {
    const item = state.cartProducts.find((item) => item.id === productId);
    return item?.quantity || 0;
  });
