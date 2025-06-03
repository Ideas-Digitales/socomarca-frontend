import { useState, useCallback } from 'react';
import { Product } from '@/interfaces/product.interface';
import useStore from '@/stores/base';
import ListsModal from '@/app/components/global/ListsModal';

interface List {
  id: string;
  name: string;
}

// Mock data para las listas
const mockLists: List[] = [
  { id: '1', name: 'Lista de deseos' },
  { id: '2', name: 'Compras mensuales' },
  { id: '3', name: 'Regalos de cumpleaños' },
];

export const useFavorites = () => {
  const { openModal, closeModal } = useStore();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [lists, setLists] = useState<List[]>(mockLists);

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
  };

  // Función para abrir el modal con las listas actualizadas
  const openListsModal = useCallback(
    (product: Product, currentLists: List[]) => {
      const handleListSelection = (listId: string) => {
        console.log(`Producto ${product.name} agregado a la lista ${listId}`);
        // Aquí puedes agregar la lógica real para agregar a la lista
      };

      const handleCreateNewList = (newListName: string) => {
        const newList: List = {
          id: Date.now().toString(), // Usar timestamp para IDs únicos
          name: newListName,
        };

        const updatedLists = [...currentLists, newList];
        setLists(updatedLists);


        // Cerrar y reabrir el modal con las listas actualizadas
        closeModal();
        setTimeout(() => {
          openListsModal(product, updatedLists);
        }, 100);
      };

      const handleSave = () => {
        console.log('Guardar cambios en listas');
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
            lists={currentLists}
            product={product}
            onAddToList={handleListSelection}
            onCreateNewList={handleCreateNewList}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        ),
      });
    },
    [openModal, closeModal, setLists]
  );

  const handleAddToList = (product: Product) => {
    openListsModal(product, lists);
  };

  return {
    favorites,
    lists,
    toggleFavorite,
    isFavorite,
    handleAddToList,
  };
};
