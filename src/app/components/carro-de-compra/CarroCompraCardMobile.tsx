import { ProductToBuy } from '@/interfaces/product.interface';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface Props {
  p: ProductToBuy;
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
  const [backgroundImage, setBackgroundImage] = useState(`url(${p.image})`);
  useEffect(() => {
    const img = new Image();
    img.src = p.image;
    img.onerror = () => {
      setBackgroundImage(`url(/assets/global/logo_plant.png)`);
    };
  }, [p.image]);
  return (
    <div
      data-cy="cart-item"
      key={p.id}
      className="relative flex gap-4 bg-white p-4 border-b border-b-slate-200"
    >
      {/* Botón eliminar arriba a la derecha */}
      <button
        data-cy="delete-product-btn"
        onClick={() => setIdProductoAEliminar(p.id)}
        className="absolute top-2 right-2 text-red-500"
        title="Eliminar producto"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
      <div
        className="w-16 h-20 bg-contain rounded bg-no-repeat bg-center"
        style={{
          backgroundImage,
        }}
      />
      {/* <img
        src={p.image}
        alt={p.name}
        className="w-16 h-20 object-contain rounded"
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = 'assets/global/logo_default.png';
          target.classList.add('grayscale', 'opacity-50');
        }}
      /> */}

      <div className="flex-1 pr-6">
        <p className="text-xs text-slate-400">{p.brand.name}</p>
        <p data-cy="cart-item-name" className="text-sm font-semibold text-black">{p.name}</p>
        <p data-cy="cart-item-price" className="text-sm font-bold text-gray-700 mt-1">
          ${(p.price * p.quantity).toLocaleString('es-CL')}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            data-cy="decrease-quantity-btn"
            onClick={() => decrementProductInCart(p.id)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            −
          </button>
          <span data-cy="cart-item-quantity" className="w-6 text-center">{p.quantity}</span>
          <button
            data-cy="increase-quantity-btn"
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
