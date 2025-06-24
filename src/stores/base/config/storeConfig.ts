import { subscribeWithSelector } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { StateCreator } from 'zustand';

// Configuración para development tools
export const withDevtools = <T>(
  f: StateCreator<T, [], [], T>,
  name?: string
) => {
  return process.env.NODE_ENV === 'development'
    ? devtools(f, { name: name || 'SocomarcaStore' })
    : f;
};

// Configuración para subscripciones
export const withSubscriptions = <T>(f: StateCreator<T, [], [], T>) =>
  subscribeWithSelector(f);

// Configuración para persistencia selectiva (si se necesita en el futuro)
export const createPersistConfig = (
  persistedKeys: string[],
  storeName: string = 'socomarca-store'
) => ({
  name: storeName,
  partialize: (state: any) => {
    const persistedState: any = {};
    persistedKeys.forEach((key) => {
      if (key in state) {
        persistedState[key] = state[key];
      }
    });
    return persistedState;
  },
});

// Lista de claves que se pueden persistir (para futuro uso)
export const PERSISTABLE_KEYS = [
  'user',
  'isLoggedIn',
  'viewMode',
  'selectedCategories',
  'selectedBrands',
  'priceRange',
] as const;

// Configuración de performance para selectores
export const createMemoizedSelector = <TState, TResult>(
  selector: (state: TState) => TResult,
  equalityFn?: (a: TResult, b: TResult) => boolean
) => {
  let lastResult: TResult;
  let lastState: TState;

  return (state: TState): TResult => {
    if (
      state !== lastState ||
      (equalityFn && !equalityFn(lastResult, selector(state)))
    ) {
      lastState = state;
      lastResult = selector(state);
    }
    return lastResult;
  };
};
