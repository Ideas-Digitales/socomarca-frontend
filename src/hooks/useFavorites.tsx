import { useCallback, useEffect, useRef } from 'react';
import { Product } from '@/interfaces/product.interface';
import useStore from '@/stores/base';
import useAuthStore from '@/stores/useAuthStore';
import ListsModal from '@/app/components/global/ListsModal';

export const useFavorites = () => {
  const {
    favoriteLists,
    selectedFavoriteList,
    isLoadingFavorites,
    favoritesInitialized,
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
  
  const { user } = useAuthStore();
  const hasInitialized = useRef(false);
  
  const isCustomer = user?.roles?.includes('customer') || false;
  
  useEffect(() => {
    // Solo inicializar si el usuario es cliente y no hemos iniciado el proceso y no estamos cargando
    if (isCustomer && !hasInitialized.current && !isLoadingFavorites && !favoritesInitialized) {
      hasInitialized.current = true;
      fetchFavorites();
    }
  }, [isCustomer, isLoadingFavorites, favoritesInitialized, fetchFavorites]);
  const toggleFavorite = async (productId: number, product?: Product) => {
    // Solo permitir toggle de favoritos si el usuario es cliente
    if (!isCustomer) {
      return { ok: false, error: 'Solo los clientes pueden usar favoritos' };
    }
    
    const result = await toggleProductFavorite(productId, product);

    if (result.requiresListSelection && result.product) {
      openListsModal(result.product);
      return result;
    }

    return result;
  };
  const handleCreateList = useCallback(
    async (name: string) => {
      // Solo permitir crear listas si el usuario es cliente
      if (!isCustomer) {
        return { ok: false, error: 'Solo los clientes pueden crear listas de favoritos' };
      }
      
      try {
        const result = await createFavoriteList(name);
        return result;
      } catch (error) {
        console.error('Error creating list:', error);
        return { ok: false, error: 'Error desconocido' };
      }
    },
    [createFavoriteList, isCustomer]
  );
  const isFavorite = useCallback(
    (productId: number) => {
      // Si el usuario no es cliente, no puede tener favoritos
      if (!isCustomer) {
        return false;
      }
      
      // Si aún está cargando o no se han inicializado los favoritos, retornamos null
      if (isLoadingFavorites || !favoritesInitialized) {
        return null;
      }
      
      return favoriteLists.some((list) =>
        list.favorites?.some((favorite) => favorite.product.id === productId)
      );
    },
    [favoriteLists, isLoadingFavorites, favoritesInitialized, isCustomer]
  );
  const openListsModal = useCallback(
    (product: Product) => {
      // Solo permitir abrir el modal si el usuario es cliente
      if (!isCustomer) {
        return;
      }
      
      const handleListSelection = async (listId: string) => {
        try {
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
            // Recargar las listas después de crear una nueva
            await fetchFavorites();
          } else {
            console.error('Error al crear lista:', result.error);
          }
        } catch (error) {
          console.error('Error creando lista:', error);
        }

        // No cerrar el modal, el componente ListsModal manejará el cambio de vista
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
      isCustomer,
    ]
  );
  const handleAddToList = (product: Product) => {
    // Solo permitir agregar a lista si el usuario es cliente
    if (!isCustomer) {
      return;
    }
    openListsModal(product);
  };
  // Función para ver el detalle de una lista
  const handleViewListDetail = useCallback(
    (listId: number) => {
      // Solo permitir ver detalles si el usuario es cliente
      if (!isCustomer) {
        return { ok: false, error: 'Solo los clientes pueden ver listas de favoritos' };
      }
      
      const list = favoriteLists.find((list) => list.id === listId);
      if (list) {
        setSelectedFavoriteList(list);
        return { ok: true, data: list };
      }
      return { ok: false, error: 'Lista no encontrada' };
    },
    [favoriteLists, setSelectedFavoriteList, isCustomer]
  );

  // Función para limpiar la lista seleccionada
  const clearSelectedList = useCallback(() => {
    setSelectedFavoriteList(null);
  }, [setSelectedFavoriteList]);
  // Función para obtener todos los IDs de productos favoritos
  const getAllFavoriteProductIds = useCallback(() => {
    // Si el usuario no es cliente, no puede tener favoritos
    if (!isCustomer) {
      return [];
    }
    
    const allIds = new Set<number>();

    // Agregar IDs de las listas del backend
    favoriteLists.forEach((list) => {
      list.favorites?.forEach((favorite) => {
        allIds.add(favorite.product.id);
      });
    });
    return Array.from(allIds);
  }, [favoriteLists, isCustomer]);

  // Función para eliminar una lista de favoritos
  const handleDeleteList = useCallback(
    async (listId: number) => {
      // Solo permitir eliminar listas si el usuario es cliente
      if (!isCustomer) {
        return { ok: false, error: 'Solo los clientes pueden eliminar listas de favoritos' };
      }
      
      try {
        const result = await removeFavoriteList(listId);
        if (result.ok) {
          // Limpiar la lista seleccionada si es la que se eliminó
          if (selectedFavoriteList?.id === listId) {
            clearSelectedList();
            // Retornar información adicional para que el componente padre maneje la redirección
            return {
              ...result,
              shouldRedirect: true,
              redirectTo: 'favoritos'
            };
          }
        }
        return result;
      } catch (error) {
        console.error('Error deleting list:', error);
        return {
          ok: false,
          error: error instanceof Error ? error.message : 'Error al eliminar la lista',
        };
      }
    },
    [removeFavoriteList, selectedFavoriteList?.id, clearSelectedList, isCustomer]
  );

  // Función para cambiar el nombre de una lista de favoritos
  const handleChangeListName = useCallback(
    async (listId: number, newName: string) => {
      // Solo permitir cambiar nombres si el usuario es cliente
      if (!isCustomer) {
        return { ok: false, error: 'Solo los clientes pueden cambiar nombres de listas de favoritos' };
      }
      
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
    [changeListName, isCustomer]
  );

  // Función para eliminar un producto de favoritos
  const handleRemoveProductFromFavorites = useCallback(
    async (favoriteId: number) => {
      // Solo permitir eliminar productos si el usuario es cliente
      if (!isCustomer) {
        return { ok: false, error: 'Solo los clientes pueden eliminar productos de favoritos' };
      }
      
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
    [removeProductFromFavorites, isCustomer]
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
    isFavorite, // Ahora puede retornar boolean | null
  };
};
