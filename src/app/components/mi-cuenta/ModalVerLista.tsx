'use client';

import { ListaFavorita } from './FavoritosSection';

export default function ModalVerLista({
  lista,
  onClose,
}: {
  lista: ListaFavorita;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-xl w-full relative">
        <h2 className="text-xl font-bold mb-4">Lista: {lista.name}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {lista.productos.map((prod, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded p-2 text-center text-sm flex flex-col items-center"
            >
              <img
                src={prod.imagen}
                alt={prod.name}
                className="w-20 h-24 object-contain rounded mb-2"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/global/logo_default.png';
                }}
              />
              <span>{prod.name}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
