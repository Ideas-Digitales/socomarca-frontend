// Exportar todos los hooks personalizados para facilitar su uso

// Hooks de carrito
export * from './useCart';

// Hooks de productos
export * from './useProducts';

// Hooks de filtros
export * from './useFilters';

// Re-exportar el store principal y hooks básicos
export { default as useStore } from '../base';
export { useInitMobileDetection, useAuthInitialization } from '../base';

// Re-exportar hooks de autenticación desde el store refactorizado
export {
  useAuthStore,
  useAuthUser,
  useAuthStatus,
  useAuthActions,
} from '../useAuthStore';
