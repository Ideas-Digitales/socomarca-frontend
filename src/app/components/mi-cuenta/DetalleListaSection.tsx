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

export default function DetalleListaSection({
  onVolver,
}: {
  onVolver: () => void;
}) {
  const router = useRouter();
  const {
    selectedFavoriteList,
    isLoadingFavorites,
    handleDeleteList,
    handleChangeListName,
    handleRemoveProductFromFavorites,
  } = useFavorites();

  const [modalVisible, setModalVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(
    null
  );
  const [eliminandoProducto, setEliminandoProducto] = useState<number | null>(
    null
  );
  console.log(selectedFavoriteList);
  const [eliminarLista, setEliminarLista] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [nombreEditado, setNombreEditado] = useState(
    selectedFavoriteList?.name || ''
  );
  const [errorNombre, setErrorNombre] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  // Actualizar el nombre editado cuando cambie la lista seleccionada
  useEffect(() => {
    if (selectedFavoriteList) {
      setNombreEditado(selectedFavoriteList.name);
    }
  }, [selectedFavoriteList]);

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
    <div className="h-fit">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onVolver}
            className="text-gray-600 hover:underline text-sm flex gap-[10px] cursor-pointer"
          >
            <ChevronLeftIcon width={20} height={20} /> Volver a favoritos
          </button>

          <div className="flex gap-4 text-sm text-gray-500">
            <button
              onClick={() => {
                setModalEditarVisible(true);
                setNombreEditado(selectedFavoriteList.name);
              }}
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

        <h2 className="text-xl font-bold mb-6">
          Productos de {selectedFavoriteList.name}
        </h2>

        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Esta lista no tiene productos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite: Favorite) => {
              const isDeleting = eliminandoProducto === favorite.id;
              return (
                <div
                  key={favorite.id}
                  className={`flex-col gap-4 justify-start border-[1px] border-slate-200 rounded flex items-start sm:items-center sm:flex-row sm:justify-between px-4 py-2 transition-opacity ${
                    isDeleting ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input type="checkbox" disabled={isDeleting} />
                    <Image
                      src="/assets/global/logo_plant.png"
                      alt={favorite.product.name}
                      width={56}
                      height={64}
                      className="object-contain rounded"
                    />
                    <div className="text-sm">
                      <p className="font-semibold">{favorite.product.name}</p>
                      <p className="text-gray-500">
                        {favorite.product.brand.name || ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-end w-full">
                    <button
                      onClick={() => {
                        setProductoAEliminar(favorite.id);
                        setModalVisible(true);
                      }}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
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
        )}

        <div className="mt-8">
          <button
            onClick={() => router.push('/carro-de-compra')}
            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
          >
            Agregar al carro
          </button>
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
                onVolver();
              } else {
                console.error('Error al eliminar la lista:', result.error);
                // Aquí podrías mostrar un mensaje de error al usuario
              }
            } catch (error) {
              console.error('Error inesperado al eliminar la lista:', error);
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
              className="w-full mt-1 p-2 bg-[#f1f5f9] rounded"
            />
            {errorNombre && (
              <p className="text-red-500 text-sm mt-1">{errorNombre}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSavingName}
              className="bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
            >
              {isSavingName ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              disabled={isSavingName}
              onClick={() => setModalEditarVisible(false)}
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
