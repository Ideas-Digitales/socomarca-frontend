'use client';

import { ListaFavorita } from "@/app/components/mi-cuenta/FavoritosSection";

export default function ModalCrearLista({
  nombre,
  setNombre,
  error,
  setError,
  onClose,
  agregarLista,
}: {
  nombre: string;
  setNombre: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  onClose: () => void;
  agregarLista: (nueva: ListaFavorita) => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('Este campo es obligatorio');
      return;
    }

    // Lógica para agregar lista vacía
    agregarLista({
      nombre,
      productos: [],
    });

    onClose();
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
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
