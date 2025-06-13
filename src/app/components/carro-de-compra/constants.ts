/**
 * Constantes de configuración para el carrito de compras
 */

export const CART_CONFIG = {
  MAX_TEXT_LENGTH: 20,
  FALLBACK_IMAGE: '/assets/global/logo_plant.png',
  CURRENCY: 'CLP',
  LOCALE: 'es-CL'
} as const;

export const BUTTON_STYLES = {
  base: "flex w-8 h-8 p-2 justify-center items-center rounded-[6px] transition-colors",
  enabled: "bg-slate-100 hover:bg-slate-200 cursor-pointer",
  disabled: "bg-slate-200 opacity-50 cursor-not-allowed"
} as const;

export const ERROR_MESSAGES = {
  DECREASE_QUANTITY: 'disminuir cantidad',
  INCREASE_QUANTITY: 'aumentar cantidad',
  REMOVE_PRODUCT: 'eliminar producto'
} as const;
