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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('Este campo es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      const result = await handleCreateList(nombre.trim());

      if (result.ok) {
        onClose();
        setNombre('');
      } else {
        setError(
          typeof result.error === 'string'
            ? result.error
            : result.error?.message || 'Error al crear la lista'
        );
      }
    } catch {
      setError('Error al crear la lista');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>{' '}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
            >
              {isLoading ? 'Creando...' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
