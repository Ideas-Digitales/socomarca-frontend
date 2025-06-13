/**
 * Constantes para la página del carrito de compras
 */

export const CART_PAGE_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_HEIGHT_DESKTOP: '60dvh',
  EMPTY_CART_IMAGE: 'assets/global/logo_plant.png',
  CURRENCY_LOCALE: 'es-CL',
} as const;

export const CART_PAGE_ROUTES = {
  HOME: '/',
  CHECKOUT: '/finalizar-compra',
  CART: '/carro-de-compra',
} as const;

export const CART_PAGE_STYLES = {
  button: {
    primary: 'bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded cursor-pointer',
    secondary: 'px-4 py-2 text-sm rounded hover:bg-gray-100',
    danger: 'px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded',
    disabled: 'bg-gray-300 cursor-not-allowed',
  },
  modal: {
    overlay: 'fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50',
    content: 'bg-white rounded-lg p-6 w-120 shadow-lg',
  },
} as const;
