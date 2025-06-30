'use client';

import Image from 'next/image';
import { useFavorites } from '@/hooks/useFavorites';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export interface ProductoFavorito {
  name: string;
  imagen: string;
  precio: number;
}

export interface ListaFavorita {
  name: string;
  productos: ProductoFavorito[];
  favorites?: any[];
  isOptimistic?: boolean;
}

export default function FavoritosSection({
  setNombreNuevaLista,
  setErrorNombreLista,
  setModalCrearListaVisible,
  onViewListDetail,
}: {
  setNombreNuevaLista: (v: string) => void;
  setErrorNombreLista: (v: string) => void;
  setModalCrearListaVisible: (v: boolean) => void;
  onViewListDetail: (lista: any) => void;
}) {
  const { lists, isLoadingFavorites } = useFavorites();

  // Estados para la lógica de creación de lista
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mostrar alerta de error
  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Lógica para crear nueva lista
  const handleCrearLista = async () => {
    setErrorNombreLista('');
    setIsLoading(true);
    try {
      // Validar nombre (puedes adaptar esto según tu flujo)
      if (!lists || lists.length === 0) {
        setNombreNuevaLista('');
      }
      // Aquí podrías abrir un input/modal para el nombre, pero si ya tienes el nombre:
      // Suponiendo que el nombre se pide en otro lado y se pasa por props
      // Si quieres pedirlo aquí, deberías agregar un input
      // Por ahora, solo abrimos el modal como antes
      setModalCrearListaVisible(true);
    } catch (error) {
      console.error('Error al crear la lista:', error);
      showErrorAlert('Error inesperado al crear la lista');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si está cargando
  if (isLoadingFavorites) {
    return (
      <div className=" p-4 rounded">
        <h2 className="text-xl font-bold mb-6">Mis favoritos</h2>
        <div className="text-center py-8">
          <p>Cargando listas...</p>
        </div>
      </div>
    );
  }
  return (
    <div className=" p-4 rounded" data-cy="favoritos-section">
      <h2 className="text-xl font-bold mb-6">Mis favoritos</h2>{' '}
      <div className="space-y-4 mb-6">
        {lists.length === 0 ? (
          <div className="bg-white rounded p-6 shadow-sm border border-[#e4eaf1] text-center">
            <p className="text-gray-500">No tienes listas de favoritos aún</p>
            <p className="text-sm text-gray-400 mt-1">
              Crea tu primera lista para comenzar
            </p>
          </div>
        ) : (
          lists.map((lista) => {
            const isOptimistic = lista.isOptimistic || false;
            // Usar un key único que combine el ID y si es optimista
            const uniqueKey =
              lista.id < 0 ? `temp-${Math.abs(lista.id)}` : `list-${lista.id}`;

            return (
              <div
                key={uniqueKey}
                data-cy="lista-favorita"
                data-optimistic={isOptimistic ? 'true' : 'false'}
                className={`bg-white rounded p-4 shadow-sm border border-[#e4eaf1] sm:flex sm:justify-between transition-opacity ${
                  isOptimistic ? 'opacity-60' : ''
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg" data-cy="nombre-lista">{lista.name}</h3>
                        {isOptimistic && (
                          <div className="flex items-center gap-1 text-xs text-gray-500" data-cy="indicador-cargando">
                            <svg
                              className="animate-spin h-3 w-3"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Creando...
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {lista.favorites?.length || 0} Productos
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto mt-2">
                    {(lista.favorites || []).slice(0, 5).map((favorite, j) => (
                      <Image
                        key={favorite.id || j}
                        src="/assets/global/logo_plant.png"
                        alt={favorite.product?.name || 'Producto'}
                        width={48}
                        height={64}
                        className="object-contain rounded"
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!isOptimistic) {
                      onViewListDetail(lista);
                    }
                  }}
                  disabled={isOptimistic}
                  data-cy="btn-revisar-lista"
                  className={`text-sm text-slate-500 flex items-center gap-1 hover:underline cursor-pointer justify-center ${
                    isOptimistic ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Revisar lista{' '}
                  <span className="text-lg">
                    <ChevronRightIcon width={14} height={14} />
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>{' '}
      {/* Alert overlay */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-10 z-[60]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">{alertMessage}</div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowAlert(false)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={handleCrearLista}
        data-cy="crear-nueva-lista"
        className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creando...
          </span>
        ) : (
          'Crear nueva lista'
        )}
      </button>
    </div>
  );
}
