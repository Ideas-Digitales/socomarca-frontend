import { StateCreator } from 'zustand';
import { FavoritesSlice, StoreState } from '../types';
import { fetchGetFavoriteLists, fetchCreateFavoriteList, fetchAddProductToFavoriteList } from '@/services/actions/favorite.actions';

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
      set({ isLoadingFavorites: true });      const response = await fetchGetFavoriteLists();
      
      if (response.ok && response.data) {
        // Asegurar que response.data sea un array
        const lists = Array.isArray(response.data) ? response.data : [];
        set({ 
          favoriteLists: lists,
          isLoadingFavorites: false 
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
        return { ok: false, error: response.error || 'Error desconocido' };
      }
    } catch (error) {
      console.error('Error in createFavoriteList:', error);
      set({ isLoadingFavorites: false });
      return { ok: false, error: 'Error desconocido' };
    }  
  },

  addProductToFavoriteList: async (favoriteListId: number, productId: number) => {
    try {
      set({ isLoadingFavorites: true });
      
      const response = await fetchAddProductToFavoriteList(favoriteListId, productId);
      
      if (response.ok) {
        // Recargar las listas después de agregar el producto
        const { fetchFavorites } = get();
        await fetchFavorites();
        set({ isLoadingFavorites: false });
        return { ok: true };
      } else {
        console.error('Error adding product to favorite list:', response.error);
        set({ isLoadingFavorites: false });
        return { ok: false, error: response.error || 'Error desconocido' };
      }
    } catch (error) {
      console.error('Error in addProductToFavoriteList:', error);
      set({ isLoadingFavorites: false });
      return { ok: false, error: 'Error desconocido' };
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
