import { TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  p: {
    id: number;
    name: string;
    brand_id: number;
    imagen: string;
    price: number;
    quantity: number;
  };
  decrementProductInCart: (id: number) => void;
  incrementProductInCart: (id: number) => void;
  setIdProductoAEliminar: (id: number) => void;
}

export default function CarroCompraCardMobile({
  p,
  decrementProductInCart,
  incrementProductInCart,
  setIdProductoAEliminar,
}: Props) {
  return (
    <div
      key={p.id}
      className="relative flex gap-4 bg-white p-4 border-b border-b-slate-200"
    >
      {/* Botón eliminar arriba a la derecha */}
      <button
        onClick={() => setIdProductoAEliminar(p.id)}
        className="absolute top-2 right-2 text-red-500"
        title="Eliminar producto"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      <img
        src={p.imagen}
        alt={p.name}
        className="w-16 h-20 object-contain rounded"
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = '/assets/global/logo_default.png';
          target.classList.add('grayscale', 'opacity-50');
        }}
      />

      <div className="flex-1 pr-6">
        <p className="text-xs text-slate-400">{p.brand_id}</p>
        <p className="text-sm font-semibold text-black">{p.name}</p>
        <p className="text-sm font-bold text-gray-700 mt-1">
          ${(p.price * p.quantity).toLocaleString('es-CL')}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => decrementProductInCart(p.id)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            −
          </button>
          <span className="w-6 text-center">{p.quantity}</span>
          <button
            onClick={() => incrementProductInCart(p.id)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
