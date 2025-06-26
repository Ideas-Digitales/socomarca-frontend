import { useCallback, useEffect, useRef } from 'react';
import { Product } from '@/interfaces/product.interface';
import useStore from '@/stores/base';
import ListsModal from '@/app/components/global/ListsModal';

export const useFavorites = () => {
  const {
    favoriteLists,
    selectedFavoriteList,
    isLoadingFavorites,
    fetchFavorites,
    setSelectedFavoriteList,
    createFavoriteList,
    addProductToFavoriteList,
    removeProductFromFavorites,
    removeFavoriteList,
    changeListName,
    openModal,
    closeModal,
    toggleProductFavorite,
  } = useStore();
  const hasInitialized = useRef(false);
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
  const toggleFavorite = async (productId: number, product?: Product) => {
    const result = await toggleProductFavorite(productId, product);

    if (result.requiresListSelection && result.product) {
      openListsModal(result.product);
      return result;
    }

    return result;
  };
  const isFavorite = (productId: number) => {
    const result = favoriteLists.some((list) =>
      list.favorites?.some((favorite) => favorite.product.id === productId)
    );
    return result;
  };
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
    (product: Product) => {
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
    openListsModal(product);
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

    // Agregar IDs de las listas del backend
    favoriteLists.forEach((list) => {
      list.favorites?.forEach((favorite) => {
        allIds.add(favorite.product.id);
      });
    });
    return Array.from(allIds);
  }, [favoriteLists]);

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

  // Función para cambiar el nombre de una lista de favoritos
  const handleChangeListName = useCallback(
    async (listId: number, newName: string) => {
      try {
        const result = await changeListName(listId, newName);
        return result;
      } catch (error) {
        console.error('Error changing list name:', error);
        return {
          ok: false,
          error: 'Error al cambiar el nombre de la lista',
        };
      }
    },
    [changeListName]
  );

  // Función para eliminar un producto de favoritos
  const handleRemoveProductFromFavorites = useCallback(
    async (favoriteId: number) => {
      try {
        const result = await removeProductFromFavorites(favoriteId);
        return result;
      } catch (error) {
        console.error('Error removing product from favorites:', error);
        return {
          ok: false,
          error: 'Error al eliminar el producto de favoritos',
        };
      }
    },
    [removeProductFromFavorites]
  );

  const isRemovingFavorite = () => {
    // Como ahora manejamos todo en el store, no necesitamos un estado local de "removing"
    return false;
  };
  return {
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
    handleChangeListName,
    handleRemoveProductFromFavorites,
    setSelectedFavoriteList,
    clearSelectedList,
    getAllFavoriteProductIds,
  };
};
