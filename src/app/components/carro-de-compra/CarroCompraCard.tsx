import { ProductToBuy } from '@/interfaces/product.interface';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface Props {
  p: ProductToBuy;
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
  const [backgroundImage, setBackgroundImage] = useState(`url(${p.image})`);

  useEffect(() => {
    const img = new Image();
    img.src = p.image;
    img.onerror = () => {
      setBackgroundImage(`url(/assets/global/logo_plant.png)`);
    };
  }, [p.image]);

  return (
    <tr key={p.id} className="border border-slate-100">
      <td className="px-4 py-4 flex items-center gap-4">
        <div
          className="w-12 h-16 p-[2px] bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage,
          }}
        />
        <div>
          <p className="text-xs text-slate-400">{p.brand.name}</p>
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
