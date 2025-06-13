import { CartItem } from '@/interfaces/product.interface';
import useStore from '@/stores/base';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface Props {
  p: CartItem;
}

export default function CarroCompraCard({ p }: Props) {
  const { addProductToCart, removeProductFromCart } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(`url(${p.image})`);

  useEffect(() => {
    const img = new Image();
    img.src = p.image;
    img.onerror = () => {
      setBackgroundImage(`url(/assets/global/logo_plant.png)`);
    };
  }, [p.image]);
  const decreaseQuantity = async () => {
    setIsLoading(true);
    if (p.quantity > 1) {
      const response = await removeProductFromCart(p, 1);
      if (!response.ok) {
        console.error('Error decrementing product in cart:');
      }
    }
    setIsLoading(false);
  };
  const increaseQuantity = async () => {
    setIsLoading(true);
    if (p.quantity < p.stock) {
      const response = await addProductToCart(p.id, 1, p.unit);
      if (!response.ok) {
        console.error('Error adding product to cart:');
      }
    }
    setIsLoading(false);
  };
  const deleteAllQuantity = async () => {
    setIsLoading(true);
    const response = await removeProductFromCart(p, p.quantity);
    if (!response.ok) {
      console.error('Error removing all quantity of product from cart:');
    }
    setIsLoading(false);
  };
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };
  const totalPrice = (p.price * p.quantity).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
  });

  const isBrandTruncated = p.brand?.name.length > 20;
  const isNameTruncated = p.name.length > 20;
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
          <p
            className="text-xs text-slate-400 cursor-help"
            title={isBrandTruncated ? p.brand.name : undefined}
          >
            {isBrandTruncated ? truncateText(p.brand.name, 20) : p.brand.name}
          </p>
          <p
            className="text-black text-xs cursor-help"
            title={isNameTruncated ? p.name : undefined}
          >
            {isNameTruncated ? truncateText(p.name, 20) : p.name}
          </p>
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={p.quantity === 0 || isLoading}
            className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
              p.quantity === 0
                ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                : 'bg-slate-100'
            }`}
            onClick={decreaseQuantity}
          >
            <span className="w-full">-</span>
          </button>
          <span className="w-8 text-center">{p.quantity}</span>
          <button
            disabled={p.quantity === p.stock || isLoading}
            className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
              p.quantity === p.stock
                ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                : 'bg-slate-100'
            }`}
            onClick={increaseQuantity}
          >
            <span className="w-full">+</span>
          </button>
        </div>
      </td>
      <td className="p-4 text-right font-bold text-gray-700">
        <div className="flex flex-row justify-between">
          <span>{totalPrice}</span>
          <button
            onClick={() => deleteAllQuantity()}
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
