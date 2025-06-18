import { useState, useCallback, useEffect, useRef } from 'react';
import { Product } from '@/interfaces/product.interface';
import useStore from '@/stores/base';
import ListsModal from '@/app/components/global/ListsModal';
import { FavoriteList } from '@/interfaces/favorite.inteface';

/**
 * Hook personalizado para manejar listas de favoritos
 * 
 * Funcionalidades:
 * - Carga automática de listas de favoritos desde el backend
 * - Gestión de estado local para favoritos individuales
 * - Modal para agregar productos a listas existentes o crear nuevas listas
 * 
 * @returns {Object} Objeto con las siguientes propiedades:
 * - lists: Array de listas de favoritos del usuario
 * - isLoadingFavorites: Estado de carga de las listas
 * - favorites: Set con los IDs de productos marcados como favoritos localmente
 * - toggleFavorite: Función para alternar el estado de favorito de un producto
 * - isFavorite: Función para verificar si un producto es favorito
 * - handleAddToList: Función para abrir el modal de agregar a lista
 * - fetchFavorites: Función para recargar las listas desde el backend
 */

export const useFavorites = () => {
  const {
    favoriteLists,
    selectedFavoriteList,
    isLoadingFavorites,
    fetchFavorites,
    setSelectedFavoriteList,
    createFavoriteList,
    addProductToFavoriteList,
    openModal,
    closeModal
  } = useStore();
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const hasInitialized = useRef(false);

  // Efecto para cargar las listas de favoritos al inicializar el hook
  useEffect(() => {
    if (!hasInitialized.current && favoriteLists.length === 0 && !isLoadingFavorites) {
      hasInitialized.current = true;
      fetchFavorites();
    }
  }, [favoriteLists.length, isLoadingFavorites, fetchFavorites]);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };
  const isFavorite = (productId: number) => {
    return favorites.has(productId);
  };  // Función para crear una nueva lista
  const handleCreateList = useCallback(async (name: string) => {
    const result = await createFavoriteList(name);
    return result;
  }, [createFavoriteList]);
  // Función para abrir el modal con las listas actualizadas
  const openListsModal = useCallback(
    (product: Product, currentLists: FavoriteList[]) => {
      // Convertir FavoriteList[] a List[] para compatibilidad con el modal
      const adaptedLists = currentLists.map(list => ({
        id: list.id.toString(),
        name: list.name
      }));

      const handleListSelection = async (listId: string) => {
        try {
          console.log(`Agregando producto ${product.name} a la lista ${listId}`);
          const result = await addProductToFavoriteList(parseInt(listId), product.id);
          
          if (result.ok) {
            console.log('Producto agregado exitosamente a la lista');
            // Actualizar el estado local de favoritos
            setFavorites(prev => new Set(prev).add(product.id));
          } else {
            console.error('Error agregando producto a la lista:', result.error);
          }
        } catch (error) {
          console.error('Error agregando producto a la lista:', error);
        }
      };

      const handleCreateNewList = async (newListName: string) => {
        try {
          console.log('Crear nueva lista:', newListName);
          const result = await handleCreateList(newListName);
          
          if (result.ok) {
            console.log('Lista creada exitosamente');
          } else {
            console.error('Error creando lista:', result.error);
          }
        } catch (error) {
          console.error('Error creando lista:', error);
        }
        
        closeModal();
      };      const handleSave = () => {
        console.log('Guardar cambios en listas - operación completada');
        closeModal();
      };

      const handleCancel = () => {
        console.log('Cancelar operación');
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
    },    [openModal, closeModal, handleCreateList, addProductToFavoriteList]
  );
  const handleAddToList = (product: Product) => {
    openListsModal(product, favoriteLists);
  };
  // Función para ver el detalle de una lista
  const handleViewListDetail = useCallback((listId: number) => {
    const list = favoriteLists.find(list => list.id === listId);
    if (list) {
      setSelectedFavoriteList(list);
      return { ok: true, data: list };
    }
    return { ok: false, error: 'Lista no encontrada' };
  }, [favoriteLists, setSelectedFavoriteList]);

  // Función para limpiar la lista seleccionada
  const clearSelectedList = useCallback(() => {
    setSelectedFavoriteList(null);
  }, [setSelectedFavoriteList]);  return {
    favorites,
    lists: Array.isArray(favoriteLists) ? favoriteLists : [],
    selectedFavoriteList,
    isLoadingFavorites,
    toggleFavorite,
    isFavorite,
    handleAddToList,
    fetchFavorites,
    handleCreateList,
    handleViewListDetail,
    setSelectedFavoriteList,
    clearSelectedList,
  };
};
