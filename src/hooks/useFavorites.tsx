import { useState, useCallback, useEffect, useRef } from 'react';
import { Product } from '@/interfaces/product.interface';
import useStore from '@/stores/base';
import ListsModal from '@/app/components/global/ListsModal';
import { FavoriteList } from '@/interfaces/favorite.inteface';

export const useFavorites = () => {  const {
    favoriteLists,
    selectedFavoriteList,
    isLoadingFavorites,
    fetchFavorites,
    setSelectedFavoriteList,
    createFavoriteList,
    addProductToFavoriteList,
    removeProductFromFavorites,
    removeFavoriteList,
    openModal,
    closeModal,
  } = useStore();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [removingFavorites, setRemovingFavorites] = useState<Set<number>>(
    new Set()
  );
  const hasInitialized = useRef(false);

  // Efecto para cargar las listas de favoritos al inicializar el hook
  useEffect(() => {
    if (
      !hasInitialized.current &&
      favoriteLists.length === 0 &&
      !isLoadingFavorites
    ) {
      hasInitialized.current = true;
      fetchFavorites();
    }
  }, [favoriteLists.length, isLoadingFavorites, fetchFavorites]);
  // Efecto para sincronizar productos favoritos del backend con el estado local
  useEffect(() => {
    if (favoriteLists.length > 0) {
      const allFavoriteProductIds = new Set<number>();

      favoriteLists.forEach((list) => {
        if (list.favorites) {
          list.favorites.forEach((favorite) => {
            allFavoriteProductIds.add(favorite.product.id);
          });
        }
      });

      setFavorites((prevFavorites) => {
        const newFavorites = new Set(prevFavorites);
        allFavoriteProductIds.forEach((id) => newFavorites.add(id));
        return newFavorites;
      });
    }
  }, [favoriteLists]);
  const toggleFavorite = async (productId: number) => {
    const wasFavorite = favorites.has(productId);

    // Actualizar estado local inmediatamente para feedback visual
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });

    // Si se está removiendo de favoritos, llamar al backend
    if (wasFavorite) {
      return;
      setRemovingFavorites((prev) => new Set(prev).add(productId));
      try {
        const result = await removeProductFromFavorites(productId);
        if (!result.ok) {
          console.error(
            'Error removiendo producto de favoritos:',
            result.error
          );
          // Revertir el cambio local si falló
          setFavorites((prev) => {
            const newFavorites = new Set(prev);
            newFavorites.add(productId);
            return newFavorites;
          });
        }
      } catch (error) {
        console.error('Error removiendo producto de favoritos:', error);
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.add(productId);
          return newFavorites;
        });
      } finally {
        setRemovingFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    }
  };
  const isFavorite = (productId: number, product?: Product) => {
    if (favorites.has(productId)) {
      return true;
    }

    if (product && product.is_favorite) {
      return true;
    }

    if (favoriteLists.length > 0) {
      return favoriteLists.some((list) =>
        list.favorites?.some((favorite) => favorite.product.id === productId)
      );
    }

    return false;
  }; // Función para crear una nueva lista
  const handleCreateList = useCallback(
    async (name: string) => {
      try {
        const result = await createFavoriteList(name);
        return result;
      } catch (error) {
        console.error('Error creating list:', error);
        return { ok: false, error: 'Error desconocido' };
      }
    },
    [createFavoriteList]
  );
  const openListsModal = useCallback(
    (product: Product, currentLists: FavoriteList[]) => {
      const adaptedLists = currentLists.map((list) => ({
        id: list.id.toString(),
        name: list.name,
      }));
      const handleListSelection = async (listId: string) => {
        try {
          console.log(
            `Agregando producto ${product.name} a la lista ${listId}`
          );
          const result = await addProductToFavoriteList(
            parseInt(listId),
            product.id,
            product.unit
          );

          if (result.ok) {
            setFavorites((prev) => new Set(prev).add(product.id));
            await fetchFavorites();
          } else {
            console.error('Error agregando producto a la lista:', result.error);
          }
        } catch (error) {
          console.error('Error agregando producto a la lista:', error);
        }
      };

      const handleCreateNewList = async (newListName: string) => {
        try {
          const result = await handleCreateList(newListName);

          if (result.ok) {
          } else {
          }
        } catch (error) {
          console.error('Error creando lista:', error);
        }

        closeModal();
      };
      const handleSave = () => {
        closeModal();
      };

      const handleCancel = () => {
        closeModal();
      };
      openModal('', {
        title: '',
        size: 'md',
        content: (
          <ListsModal
            lists={adaptedLists}
            product={product}
            onAddToList={handleListSelection}
            onCreateNewList={handleCreateNewList}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        ),
      });
    },
    [
      openModal,
      closeModal,
      handleCreateList,
      addProductToFavoriteList,
      fetchFavorites,
    ]
  );
  const handleAddToList = (product: Product) => {
    openListsModal(product, favoriteLists);
  };
  // Función para ver el detalle de una lista
  const handleViewListDetail = useCallback(
    (listId: number) => {
      const list = favoriteLists.find((list) => list.id === listId);
      if (list) {
        setSelectedFavoriteList(list);
        return { ok: true, data: list };
      }
      return { ok: false, error: 'Lista no encontrada' };
    },
    [favoriteLists, setSelectedFavoriteList]
  );

  // Función para limpiar la lista seleccionada
  const clearSelectedList = useCallback(() => {
    setSelectedFavoriteList(null);
  }, [setSelectedFavoriteList]);
  // Función para obtener todos los IDs de productos favoritos
  const getAllFavoriteProductIds = useCallback(() => {
    const allIds = new Set<number>();

    // Agregar IDs del estado local
    favorites.forEach((id) => allIds.add(id));

    // Agregar IDs de las listas del backend
    favoriteLists.forEach((list) => {
      list.favorites?.forEach((favorite) => {
        allIds.add(favorite.product.id);
      });
    });    return Array.from(allIds);
  }, [favorites, favoriteLists]);

  // Función para eliminar una lista de favoritos
  const handleDeleteList = useCallback(
    async (listId: number) => {
      try {
        const result = await removeFavoriteList(listId);
        if (result.ok) {
          // Limpiar la lista seleccionada si es la que se eliminó
          if (selectedFavoriteList?.id === listId) {
            clearSelectedList();
          }
        }
        return result;
      } catch (error) {
        console.error('Error deleting list:', error);
        return {
          ok: false,
          error: 'Error al eliminar la lista',
        };
      }
    },
    [removeFavoriteList, selectedFavoriteList?.id, clearSelectedList]
  );

  const isRemovingFavorite = (productId: number) => {
    return removingFavorites.has(productId);
  };  return {
    favorites,
    lists: Array.isArray(favoriteLists) ? favoriteLists : [],
    selectedFavoriteList,
    isLoadingFavorites,
    toggleFavorite,
    isFavorite,
    isRemovingFavorite,
    handleAddToList,
    fetchFavorites,
    handleCreateList,
    handleViewListDetail,
    handleDeleteList,
    setSelectedFavoriteList,
    clearSelectedList,
    getAllFavoriteProductIds,
  };
};
