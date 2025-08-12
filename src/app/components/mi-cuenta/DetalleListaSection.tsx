'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import ModalConfirmacion from '../global/ModalConfirmacion';
import ModalBase from '../global/ModalBase';
import { useFavorites } from '@/hooks/useFavorites';
import { Favorite } from '@/interfaces/favorite.inteface';
import { useCartActions } from '@/stores/hooks/useCart';

export default function DetalleListaSection({
  onVolver,
  onListDeleted,
}: {
  onVolver: () => void;
  onListDeleted?: () => void;
}) {
  const router = useRouter();
  const {
    selectedFavoriteList,
    isLoadingFavorites,
    handleDeleteList,
    handleChangeListName,
    handleRemoveProductFromFavorites,
  } = useFavorites();

  const { addProductToCart } = useCartActions();

  const [modalVisible, setModalVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(
    null
  );
  const [eliminandoProducto, setEliminandoProducto] = useState<number | null>(
    null
  );
  const [eliminarLista, setEliminarLista] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [nombreEditado, setNombreEditado] = useState(
    selectedFavoriteList?.name || ''
  );
  const [errorNombre, setErrorNombre] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  // Estados para la selección de productos
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addingProducts, setAddingProducts] = useState<Set<number>>(new Set());

  // Actualizar el nombre editado cuando cambie la lista seleccionada
  useEffect(() => {
    if (selectedFavoriteList) {
      setNombreEditado(selectedFavoriteList.name);
    }
  }, [selectedFavoriteList]);

  // Función para manejar la selección de productos
  const handleProductSelection = (productId: number, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  // Función para seleccionar/deseleccionar todos los productos
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allProductIds = favorites.map(favorite => favorite.product.id);
      setSelectedProducts(new Set(allProductIds));
    } else {
      setSelectedProducts(new Set());
    }
  };

  // Función para agregar productos seleccionados al carrito
  const handleAddSelectedToCart = async () => {
    if (selectedProducts.size === 0) {
      return;
    }

    setIsAddingToCart(true);
    const productsToAdd = favorites.filter(favorite => 
      selectedProducts.has(favorite.product.id)
    );

    try {
      for (const favorite of productsToAdd) {
        setAddingProducts(prev => new Set(prev).add(favorite.product.id));
        
        const result = await addProductToCart(
          favorite.product.id,
          1, // cantidad por defecto
          favorite.product.unit
        );

        if (!result.ok) {
          console.error(`Error al agregar ${favorite.product.name}:`, result.error);
        }

        setAddingProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(favorite.product.id);
          return newSet;
        });
      }

      // Limpiar selección después de agregar
      setSelectedProducts(new Set());
      
      // Navegar al carrito
      router.push('/carro-de-compra');
    } catch (error) {
      console.error('Error al agregar productos al carrito:', error);
    } finally {
      setIsAddingToCart(false);
      setAddingProducts(new Set());
    }
  };

  // Loading state
  if (isLoadingFavorites) {
    return (
      <div className="h-fit">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onVolver}
            className="text-gray-600 hover:underline text-sm mb-4 flex gap-[10px] cursor-pointer"
          >
            <ChevronLeftIcon width={20} height={20} /> Volver a favoritos
          </button>
          <div className="text-center py-8">
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  // No selected list
  if (!selectedFavoriteList) {
    return (
      <div className="h-fit">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onVolver}
            className="text-gray-600 hover:underline text-sm mb-4 flex gap-[10px] cursor-pointer"
          >
            <ChevronLeftIcon width={20} height={20} /> Volver a favoritos
          </button>
          <div className="text-center py-8">
            <p>No se ha seleccionado ninguna lista</p>
          </div>
        </div>
      </div>
    );
  }

  const favorites = selectedFavoriteList.favorites || [];

  const eliminarProducto = async (favoriteId: number) => {
    try {
      setEliminandoProducto(favoriteId);
      const result = await handleRemoveProductFromFavorites(favoriteId);

      if (!result.ok) {
        // Si hay error, podrías mostrar un toast o mensaje de error
        console.error('Error al eliminar producto:', result.error);
      }
    } catch (error) {
      console.error('Error inesperado al eliminar producto:', error);
    } finally {
      setEliminandoProducto(null);
    }
  };

  return (
    <div className="h-fit px-4 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <button
            onClick={onVolver}
            className="text-gray-600 hover:underline text-sm flex gap-[10px] cursor-pointer items-center"
          >
            <ChevronLeftIcon width={20} height={20} /> Volver a favoritos
          </button>

          <div className="flex gap-4 text-sm text-gray-500 justify-end">
            <button
              onClick={() => {
                setModalEditarVisible(true);
                setNombreEditado(selectedFavoriteList.name);
              }}
              data-cy="btn-editar-lista"
              className="flex items-center gap-1 hover:text-lime-600 cursor-pointer"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Editar
            </button>{' '}
            <button
              onClick={() => {
                setEliminarLista(true);
                setModalVisible(true);
              }}
              data-cy="btn-eliminar-lista"
              className="flex items-center gap-1 hover:text-red-600 cursor-pointer"
            >
              <TrashIcon className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 truncate">
          Productos de {selectedFavoriteList.name}
        </h2>

        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Esta lista no tiene productos</p>
          </div>
        ) : (
          <>
            {/* Header con checkbox para seleccionar todos */}
            <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={selectedProducts.size === favorites.length && favorites.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="flex-shrink-0"
              />
              <span className="text-sm text-gray-600">
                {selectedProducts.size > 0 
                  ? `${selectedProducts.size} de ${favorites.length} productos seleccionados`
                  : 'Seleccionar todos los productos'
                }
              </span>
            </div>

            <div className="space-y-1">
              {favorites.map((favorite: Favorite) => {
                const isDeleting = eliminandoProducto === favorite.id;
                const isAdding = addingProducts.has(favorite.product.id);
                const isSelected = selectedProducts.has(favorite.product.id);
                
                return (
                  <div
                    key={favorite.id}
                    className={`flex flex-col gap-3 border-[1px] border-slate-200 bg-white rounded p-4 transition-opacity min-w-0 md:flex-row md:items-center md:justify-between md:gap-4 md:py-3 ${
                      isDeleting ? 'opacity-50 pointer-events-none' : ''
                    } ${isSelected ? 'border-lime-500 bg-lime-50' : ''}`}
                  >
                    {/* Sección principal con checkbox, imagen y detalles */}
                    <div className="flex items-center gap-3 flex-1 min-w-0 md:gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleProductSelection(favorite.product.id, e.target.checked)}
                        disabled={isDeleting || isAdding}
                        className="flex-shrink-0"
                      />
                      <Image
                        src="/assets/global/logo_plant.png"
                        alt={favorite.product.name}
                        width={56}
                        height={64}
                        className="object-contain rounded flex-shrink-0 w-12 h-14 md:w-14 md:h-16"
                      />
                      <div className="text-sm min-w-0 flex-1">
                        <p
                          className="font-semibold text-gray-900 truncate pr-2 text-sm md:text-base"
                          title={favorite.product.name}
                        >
                          {favorite.product.name}
                        </p>
                        <p
                          className="text-gray-500 truncate pr-2 text-xs md:text-sm"
                          title={favorite.product.brand.name || ''}
                        >
                          {favorite.product.brand.name || ''}
                        </p>
                      </div>
                    </div>

                    {/* Botón de eliminar */}
                    <div className="flex items-center justify-center md:justify-end flex-shrink-0 pt-2 md:pt-0">
                      <button
                        onClick={() => {
                          setProductoAEliminar(favorite.id);
                          setModalVisible(true);
                        }}
                        disabled={isDeleting || isAdding}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 md:p-1"
                      >
                        {isDeleting || isAdding ? (
                          <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <div className="cursor-pointer">
                            <TrashIcon className="w-5 h-5" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddSelectedToCart}
            disabled={selectedProducts.size === 0 || isAddingToCart}
            className="w-full sm:w-auto bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm sm:text-base flex items-center justify-center gap-2"
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Agregando...
              </>
            ) : (
              `Agregar ${selectedProducts.size > 0 ? `(${selectedProducts.size})` : ''} al carro`
            )}
          </button>
          
          {selectedProducts.size === 0 && (
            <button
              onClick={() => router.push('/carro-de-compra')}
              className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-2 rounded text-sm sm:text-base"
            >
              Ver carro
            </button>
          )}
        </div>
      </div>{' '}
      <ModalConfirmacion
        isOpen={modalVisible}
        titulo={
          eliminarLista ? '¿Eliminar lista completa?' : '¿Eliminar producto?'
        }
        descripcion={
          eliminarLista
            ? 'Esta acción eliminará la lista y todos sus productos.'
            : productoAEliminar !== null
            ? `El producto se quitará de tu lista.`
            : '¿Estás seguro que deseas eliminar este producto?'
        }
        onCancel={() => {
          setModalVisible(false);
          setProductoAEliminar(null);
          setEliminarLista(false);
        }}
        onConfirm={async () => {
          if (eliminarLista && selectedFavoriteList) {
            try {
              const result = await handleDeleteList(selectedFavoriteList.id);
              if (result.ok) {
                // Si la eliminación fue exitosa, usar la función específica para listas eliminadas
                if (onListDeleted) {
                  onListDeleted();
                } else {
                  onVolver();
                }
              } else {
                console.error('Error al eliminar la lista:', result.error);
                // Mostrar mensaje de error al usuario (podrías usar un toast aquí)
                alert('Error al eliminar la lista. Por favor, inténtalo de nuevo.');
              }
            } catch (error) {
              console.error('Error inesperado al eliminar la lista:', error);
              // Mostrar mensaje de error al usuario
              alert('Error inesperado al eliminar la lista. Por favor, inténtalo de nuevo.');
            }
          } else if (productoAEliminar !== null) {
            eliminarProducto(productoAEliminar);
          }
          setModalVisible(false);
          setProductoAEliminar(null);
          setEliminarLista(false);
        }}
      />
      <ModalBase
        isOpen={modalEditarVisible}
        title="Editar lista"
        onClose={() => setModalEditarVisible(false)}
        data-cy="modal-editar-lista"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!nombreEditado.trim()) {
              setErrorNombre('Este campo es obligatorio');
              return;
            }

            if (!selectedFavoriteList) {
              setErrorNombre('No hay lista seleccionada');
              return;
            }

            try {
              setIsSavingName(true);
              const result = await handleChangeListName(
                selectedFavoriteList.id,
                nombreEditado.trim()
              );
              if (result.ok) {
                setModalEditarVisible(false);
                setErrorNombre('');
              } else {
                const errorMessage =
                  typeof result.error === 'string'
                    ? result.error
                    : result.error?.message || 'Error al actualizar el nombre';
                setErrorNombre(errorMessage);
              }
            } catch (error) {
              console.error('Error updating list name:', error);
              setErrorNombre('Error inesperado al actualizar el nombre');
            } finally {
              setIsSavingName(false);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-medium">
              Nombre de lista <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombreEditado}
              onChange={(e) => {
                setNombreEditado(e.target.value);
                setErrorNombre('');
              }}
              data-cy="input-editar-nombre-lista"
              className="w-full mt-1 p-2 bg-[#f1f5f9] rounded"
            />
            {errorNombre && (
              <p className="text-red-500 text-sm mt-1" data-cy="error-nombre-lista">{errorNombre}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSavingName}
              data-cy="btn-guardar-nombre-lista"
              className="bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
            >
              {isSavingName ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              disabled={isSavingName}
              onClick={() => setModalEditarVisible(false)}
              data-cy="btn-cancelar-editar-lista"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}
