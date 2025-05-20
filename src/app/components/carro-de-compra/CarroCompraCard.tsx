import { TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  p: {
    id: number;
    name: string;
    brand: {
      brand_name: string;
    };
    imagen: string;
    price: number;
    quantity: number;
  };
  decrementProductInCart: (id: number) => void;
  incrementProductInCart: (id: number) => void;
  setIdProductoAEliminar: (id: number) => void;
}

export default function CarroCompraCard({
  p,
  decrementProductInCart,
  incrementProductInCart,
  setIdProductoAEliminar,
}: Props) {
  return (
    <tr key={p.id} className="border border-slate-100">
      <td className="px-4 py-2 flex items-center gap-4">
        <img
          src={p.imagen}
          alt={p.name}
          className="w-12 h-16 object-contain rounded"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = '/assets/global/logo_default.png';
            target.classList.add('grayscale', 'opacity-50');
          }}
        />
        <div>
          <p className="text-xs text-slate-400">{p.brand.brand_name}</p>
          <p className="text-black text-xs">{p.name}</p>
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => decrementProductInCart(p.id)}
            className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
          >
            −
          </button>
          <span className="w-8 text-center">{p.quantity}</span>
          <button
            onClick={() => incrementProductInCart(p.id)}
            className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
          >
            +
          </button>
        </div>
      </td>
      <td className="p-4 text-right font-bold text-gray-700">
        <div className="flex flex-row justify-between">
          <span>${(p.price * p.quantity).toLocaleString('es-CL')}</span>
          <button
            onClick={() => setIdProductoAEliminar(p.id)}
            className=" hover:cursor-pointer text-red-500"
            title="Eliminar producto"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
