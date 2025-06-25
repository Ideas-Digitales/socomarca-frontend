'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
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
  const { selectedFavoriteList, isLoadingFavorites, handleDeleteList } = useFavorites();

  const [modalVisible, setModalVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(
    null
  );
  const [eliminarLista, setEliminarLista] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [nombreEditado, setNombreEditado] = useState(
    selectedFavoriteList?.name || ''
  );
  const [errorNombre, setErrorNombre] = useState('');

  // Loading state
  if (isLoadingFavorites) {
    return (
      <div className="h-fit">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onVolver}
            className="text-gray-600 hover:underline text-sm mb-4"
          >
            ← Volver a favoritos
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
            className="text-gray-600 hover:underline text-sm mb-4"
          >
            ← Volver a favoritos
          </button>
          <div className="text-center py-8">
            <p>No se ha seleccionado ninguna lista</p>
          </div>
        </div>
      </div>
    );
  }

  const favorites = selectedFavoriteList.favorites || [];
  const eliminarProducto = (favoriteId: number) => {
    // TODO: Implement delete product from favorites list
    console.log('Eliminar producto con ID:', favoriteId);
  };

  return (
    <div className="h-fit">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onVolver}
            className="text-gray-600 hover:underline text-sm"
          >
            ← Volver a favoritos
          </button>

          <div className="flex gap-4 text-sm text-gray-500">
            <button
              onClick={() => {
                setModalEditarVisible(true);
                setNombreEditado(selectedFavoriteList.name);
              }}
              className="flex items-center gap-1 hover:text-lime-600"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Editar
            </button>            <button
              onClick={() => {
                setEliminarLista(true);
                setModalVisible(true);
              }}
              data-cy="btn-eliminar-lista"
              className="flex items-center gap-1 hover:text-red-600"
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
            {favorites.map((favorite: Favorite) => (
              <div
                key={favorite.id}
                className="bg-slate-100 flex-col gap-4 justify-start rounded flex items-start sm:items-center sm:flex-row sm:justify-between border border-slate-200 px-4 py-2 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <input type="checkbox" />{' '}
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
                      {favorite.product.description || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-end w-full">
                  <div className="flex items-center rounded px-2">
                    <button
                      onClick={() => {
                        // TODO: Implement quantity change
                        console.log('Cambiar cantidad');
                      }}
                      className="px-2 text-gray-700 bg-white border border-gray-300 rounded"
                    >
                      -
                    </button>
                    <span className="px-2">1</span>
                    <button
                      onClick={() => {
                        // TODO: Implement quantity change
                        console.log('Cambiar cantidad');
                      }}
                      className="px-2 text-gray-700 border border-gray-300 rounded bg-white"
                    >
                      +
                    </button>
                  </div>{' '}
                  {/* <span className="font-bold text-gray-700">{favorite.price}</span> */}
                  <button
                    onClick={() => {
                      setProductoAEliminar(favorite.id);
                      setModalVisible(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
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
        }}        onConfirm={async () => {
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
          onSubmit={(e) => {
            e.preventDefault();
            if (!nombreEditado.trim()) {
              setErrorNombre('Este campo es obligatorio');
              return;
            }

            // TODO: Aquí puedes actualizar el nombre de la lista en tu store o backend
            console.log('Nuevo nombre:', nombreEditado);
            setModalEditarVisible(false);
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
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setModalEditarVisible(false)}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}
