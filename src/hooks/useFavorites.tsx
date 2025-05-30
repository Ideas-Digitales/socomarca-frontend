import { useState } from 'react';
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

  const handleAddToList = (product: Product) => {
    const handleListSelection = (listId: string) => {
      console.log(`Producto ${product.name} agregado a la lista ${listId}`);
      // Aquí puedes agregar la lógica real para agregar a la lista
    };

    const handleCreateNewList = () => {
      console.log('Crear nueva lista');
      // Aquí puedes agregar la lógica para crear una nueva lista
    };

    const handleSave = () => {
      console.log('Guardar cambios en listas');
      closeModal();
    };

    openModal('', {
      title: '',
      size: 'md',
      content: (
        <ListsModal
          lists={mockLists}
          product={product}
          onAddToList={handleListSelection}
          onCreateNewList={handleCreateNewList}
          onCancel={closeModal}
          onSave={handleSave}
        />
      ),
    });
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    handleAddToList,
  };
};
