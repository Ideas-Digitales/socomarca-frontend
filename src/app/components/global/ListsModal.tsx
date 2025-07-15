import { Product } from '@/interfaces/product.interface';
import { HeartIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import HR from '../global/HR';
import { useState, useEffect } from 'react';
import useStore from '@/stores/base';

interface ListsModalProps {
  product: Product;
  onAddToList: (listId: string) => Promise<void>;
  onCreateNewList: (newListName: string) => Promise<void>;
  onCancel: () => void;
  onSave: () => void;
}

const ListsModal = ({
  product,
  onAddToList,
  onCancel,
  onCreateNewList,
  onSave,
}: ListsModalProps) => {
  const { favoriteLists, isLoadingFavorites, fetchFavorites } = useStore();
  
  const [currentView, setCurrentView] = useState<'lists' | 'createList'>(
    'lists'
  );
  const [newListName, setNewListName] = useState('');
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(
    new Set()
  );
  
  // Estados de carga internos del modal
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Cargar listas al montar el componente
  useEffect(() => {
    const loadLists = async () => {
      try {
        setHasError(false);
        await fetchFavorites();
      } catch (error) {
        console.error('Error loading favorite lists:', error);
        setHasError(true);
      }
    };

    if (favoriteLists.length === 0 && !isLoadingFavorites) {
      loadLists();
    }
  }, [fetchFavorites, favoriteLists.length, isLoadingFavorites]);

  // Adaptar las listas para el formato esperado por el componente
  const adaptedLists = favoriteLists.map((list) => ({
    id: list.id.toString(),
    name: list.name,
  }));

  const handleListToggle = (listId: string) => {
    setSelectedListIds((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(listId)) {
        newSelected.delete(listId);
      } else {
        newSelected.add(listId);
      }
      return newSelected;
    });
  };
  const handleSaveSelections = async () => {
    setIsAddingToList(true);
    try {
      // Agregar el producto a todas las listas seleccionadas
      for (const listId of selectedListIds) {
        await onAddToList(listId);
      }
      onSave();
    } finally {
      setIsAddingToList(false);
    }
  };

  const handleCreateNewList = async () => {
    if (newListName.trim() === '') {
      alert('Por favor, ingresa un nombre para la nueva lista.');
      return;
    }
    setIsCreatingList(true);
    try {
      await onCreateNewList(newListName);
      setNewListName('');
      setCurrentView('lists');
      // Recargar las listas después de crear una nueva
      await fetchFavorites();
    } catch (error) {
      console.error('Error en handleCreateNewList:', error);
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleBackToLists = () => {
    setCurrentView('lists');
    setNewListName('');
  };

  const createListView = (
    <div className="space-y-4">
      <h5 className="font-semibold text-2xl">Crear nueva lista</h5>
      <p className="text-slate-500 w-full">Nombre de la lista</p>{' '}
      <input
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        type="text"
        className="border border-slate-300 rounded px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="Ingresa el nombre de la lista"
        disabled={isCreatingList}
      />
      <div className="flex items-center justify-between">
        {' '}
        <button
          className="bg-lime-500 text-white hover:bg-lime-600 transition-colors ease-in-out duration-300 px-12 py-3 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCreateNewList}
          disabled={isCreatingList}        >
          {isCreatingList ? (
            <div className="flex items-center justify-center">
              <ArrowPathIcon className="animate-spin w-4 h-4" />
            </div>
          ) : (
            'Crear'
          )}
        </button>
        <button>
          <span
            className="bg-slate-500 text-white hover:bg-slate-600 transition-colors ease-in-out duration-300 px-12 py-3 border-[1px] cursor-pointer rounded"
            onClick={handleBackToLists}
          >
            Cancelar
          </span>
        </button>
      </div>
    </div>
  );

  const listsView = (
    <div className="space-y-4">
      <div className="flex gap-4">
        <HeartIcon width={32} height={32} />
        <div className="flex flex-col">
          <h5 className="font-semibold">Guardar</h5>
          {product.name}
        </div>
      </div>
      <p className="text-slate-500 w-full">
        Selecciona la lista en la que deseas agregar el producto.
      </p>
      <HR />
      <h5 className="font-semibold">Mis listas</h5>
      
      {isLoadingFavorites && !isAddingToList ? (
        <div className="flex items-center justify-center py-8">
          <ArrowPathIcon className="animate-spin w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-500">Cargando listas...</span>
        </div>
      ) : hasError ? (
        <div className="text-center py-8">
          <p className="text-red-500">No se encuentran listas</p>
          <button
            onClick={() => setCurrentView('createList')}
            className="text-lime-500 hover:text-lime-600 mt-2 underline transition-colors duration-300"
          >
            + Crear nueva lista
          </button>
        </div>
      ) : (
        <ul className="flex flex-col space-y-2 max-h-[30dvh] overflow-y-auto">
          {adaptedLists.length > 0 ? (
            adaptedLists.map((list) => (
              <label
                htmlFor={`product-${list.id}`}
                className="cursor-pointer hover:bg-slate-100 ease-in-out duration-300 transition-colors"
                key={list.id}
              >
                <li className="flex items-center px-2 py-4 gap-4 ">
                  {' '}
                  <input
                    id={`product-${list.id}`}
                    type="checkbox"
                    checked={selectedListIds.has(list.id)}
                    onChange={() => handleListToggle(list.id)}
                    disabled={isAddingToList}
                  />
                  <span>{list.name}</span>
                </li>
                <HR />
              </label>
            ))
          ) : (
            <li className="text-slate-500">No tienes listas creadas.</li>
          )}
        </ul>
      )}

      {!isLoadingFavorites && !hasError && !isAddingToList && (
        <div className="flex items-center justify-between">
          <button
            className="text-lime-500 hover:text-lime-600 mt-4 underline transition-colors duration-300"
            onClick={() => setCurrentView('createList')}
          >
            + Crear nueva lista
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          className="bg-slate-500 text-white hover:bg-slate-600 transition-colors ease-in-out duration-300 px-12 py-3 border-[1px] cursor-pointer rounded"
          onClick={onCancel}
        >
          Cancelar
        </button>{' '}
        <button
          className="bg-lime-500 text-white hover:bg-lime-600 transition-colors ease-in-out duration-300 px-12 py-3 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveSelections}
          disabled={selectedListIds.size === 0 || isAddingToList}        >
          {isAddingToList ? (
            <div className="flex items-center justify-center">
              <ArrowPathIcon className="animate-spin w-4 h-4" />
            </div>
          ) : (
            'Guardar'
          )}
        </button>
      </div>
    </div>
  );

  return <>{currentView === 'lists' ? listsView : createListView}</>;
};

export default ListsModal;
