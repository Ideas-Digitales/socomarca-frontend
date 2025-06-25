import { StateCreator } from 'zustand';
import { FavoritesSlice, StoreState } from '../types';
import {
  fetchGetFavoriteLists,
  fetchCreateFavoriteList,
  fetchAddProductToFavoriteList,
  fetchRemoveProductFromFavorites,
  deleteFavoriteList,
} from '@/services/actions/favorite.actions';

export const createFavoritesSlice: StateCreator<
  StoreState & FavoritesSlice,
  [],
  [],
  FavoritesSlice
> = (set, get) => ({
  // Estados de favoritos
  favoriteLists: [],
  selectedFavoriteList: null,
  isLoadingFavorites: false,
  showOnlyFavorites: false,

  // Acciones
  fetchFavorites: async () => {
    try {
      set({ isLoadingFavorites: true });
      const response = await fetchGetFavoriteLists();

      if (response.ok && response.data) {
        // Asegurar que response.data sea un array
        const lists = Array.isArray(response.data) ? response.data : [];
        set({
          favoriteLists: lists,
          isLoadingFavorites: false,
        });
      } else {
        console.error('Error fetching favorite lists:', response.error);
        set({ isLoadingFavorites: false });
      }
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
      set({ isLoadingFavorites: false });
    }
  },
  createFavoriteList: async (name: string) => {
    try {
      set({ isLoadingFavorites: true });

      const response = await fetchCreateFavoriteList(name);

      if (response.ok) {
        // Recargar las listas después de crear una nueva
        const { fetchFavorites } = get();
        await fetchFavorites();
        return { ok: true };
      } else {
        console.error('Error creating favorite list:', response.error);
        set({ isLoadingFavorites: false });
        return {
          ok: false,
          error: {
            message: response.error || 'Error desconocido',
            status: 500,
          },
        };
      }
    } catch (error) {
      console.error('Error in createFavoriteList:', error);
      set({ isLoadingFavorites: false });
      return {
        ok: false,
        error: {
          message: 'Error desconocido',
          status: 500,
        },
      };
    }
  },
  addProductToFavoriteList: async (
    favoriteListId: number,
    productId: number,
    unit: string
  ) => {
    try {
      set({ isLoadingFavorites: true });

      const response = await fetchAddProductToFavoriteList(
        favoriteListId,
        productId,
        unit
      );

      if (response.ok) {
        // Recargar las listas después de agregar el producto
        const { fetchFavorites } = get();
        await fetchFavorites();
        set({ isLoadingFavorites: false });
        return { ok: true };
      } else {
        console.error('Error adding product to favorite list:', response.error);
        set({ isLoadingFavorites: false });
        return {
          ok: false,
          error: {
            message: response.error || 'Error desconocido',
            status: 500,
          },
        };
      }
    } catch (error) {
      console.error('Error in addProductToFavoriteList:', error);
      set({ isLoadingFavorites: false });
      return {
        ok: false,
        error: {
          message: 'Error desconocido',
          status: 500,
        },
      };
    }
  },
  removeProductFromFavorites: async (productId: number) => {
    try {
      set({ isLoadingFavorites: true });

      const response = await fetchRemoveProductFromFavorites(productId);

      if (response.ok) {
        // Recargar las listas después de remover el producto
        const { fetchFavorites } = get();
        await fetchFavorites();
        set({ isLoadingFavorites: false });
        return { ok: true };
      } else {
        console.error('Error removing product from favorites:', response.error);
        set({ isLoadingFavorites: false });
        return {
          ok: false,
          error: {
            message: response.error || 'Error desconocido',
            status: 500,
          },
        };
      }
    } catch (error) {
      console.error('Error in removeProductFromFavorites:', error);
      set({ isLoadingFavorites: false });
      return {
        ok: false,
        error: {
          message: 'Error desconocido',
          status: 500,
        },
      };
    }
  },

  removeFavoriteList: async (listId: number) => {
    try {
      set({ isLoadingFavorites: true });
      const response = await deleteFavoriteList(listId);
      if (response.ok) {
        const { fetchFavorites } = get();
        await fetchFavorites();
        return { ok: true };
      } else {
        console.error('Error removing favorite list:', response.error);
        return {
          ok: false,
          error: {
            message: response.error || 'Error desconocido',
            status: 500,
          },
        };
      }
    } catch (error) {
      console.error('Error removing favorite list:', error);
      return {
        ok: false,
        error: {
          message: 'Error desconocido',
          status: 500,
        },
      };
    } finally {
      set({ isLoadingFavorites: false });
    }
  },

  setShowOnlyFavorites: (show: boolean) => {
    set({ showOnlyFavorites: show });
  },

  toggleShowOnlyFavorites: () => {
    const { showOnlyFavorites } = get();
    set({ showOnlyFavorites: !showOnlyFavorites });
  },
  getFavoriteProductIds: () => {
    // Esta función se mantiene por compatibilidad pero no se usa en el filtro
    return [];
  },

  resetFavoritesState: () => {
    set({
      favoriteLists: [],
      isLoadingFavorites: false,
      showOnlyFavorites: false,
    });
  },

  setSelectedFavoriteList: (list: any | null) => {
    set({ selectedFavoriteList: list });
  },
});
