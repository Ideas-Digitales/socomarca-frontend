'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

export default function ModalCrearLista({
  nombre,
  setNombre,
  error,
  setError,
  onClose,
}: {
  nombre: string;
  setNombre: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  onClose: () => void;
}) {
  const { handleCreateList } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('Este campo es obligatorio');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await handleCreateList(nombre.trim());

      if (result.ok) {
        onClose();
        setNombre('');
        setError('');
      } else {
        const errorMessage =
          typeof result.error === 'string'
            ? result.error
            : result.error?.message || 'Error al crear la lista';

        showErrorAlert(`No se pudo crear la lista: ${errorMessage}`);
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Error inesperado al crear la lista';
      showErrorAlert(`No se pudo crear la lista: ${errorMessage}`);
      setError(errorMessage);
      console.error('Error creating list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

      {/* Modal */}
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Crear nueva lista</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">
                Nombre de lista <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setError('');
                }}
                data-cy="input-nombre-lista"
                className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
                disabled={isLoading}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                data-cy="btn-crear-lista"
                className="bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded transition-colors"
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
                  'Crear'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
