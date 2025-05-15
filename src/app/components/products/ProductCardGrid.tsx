import { Product } from '@/interfaces/product.interface';
import { useState } from 'react';
import useStore from '@/stores/useStore';
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeathIconSolid } from '@heroicons/react/24/solid';

interface Props {
  product: Product;
}

export default function ProductCardGrid({ product }: Props) {
  const { addProductToCart } = useStore();
  const [quantity, setQuantity] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false);
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity >= product.stock) {
      return;
    }
    setQuantity(quantity + 1);
  };

  const addToCart = () => {
    if (quantity > 0) {
      addProductToCart(product, quantity);
      setQuantity(0);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="flex p-3 items-center flex-col justify-between gap-2 bg-white w-full max-w-[220px] h-[320px] border-b-slate-200 border-b">
      {/* Imagen del producto */}
      <div className="flex items-center justify-center h-[100px] w-full">
        <div
          className="w-full h-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${product.imagen})` }}
        >
          <div className="rounded-full bg-slate-100 items-center justify-center hidden absolute sm:flex p-[6px]">
            {!isFavorite ? (
              <HeartIcon
                className="cursor-pointer"
                color="#475569"
                width={16}
                height={16}
                onClick={toggleFavorite}
              />
            ) : (
              <HeathIconSolid
                className="cursor-pointer"
                color="#475569"
                width={16}
                height={16}
                onClick={toggleFavorite}
              />
            )}
          </div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="flex flex-col w-full items-center">
        <span className="text-[#64748B] text-xs font-medium">
          {product.brand_id}
        </span>
        <span className="text-sm font-medium text-center">
          {truncateText(product.name, 25)}
        </span>
        <span className="text-lime-500 font-bold text-center text-lg mt-1">
          {product.price.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
          }) || '$0'}
        </span>
      </div>

      {/* Controles de cantidad y botón */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Información de stock */}
        <div className="w-full px-2 py-1 text-center">
          <p className="text-[#64748B] text-xs">
            <span className="font-semibold">Stock:</span> {product.stock}
          </p>
          <p className="text-[#64748B] text-xs">
            <span className="font-semibold">SKU:</span> {product.sku}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button
            disabled={quantity === 0}
            className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
              quantity === 0
                ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                : 'bg-slate-100 text-slate-950'
            }`}
            onClick={decreaseQuantity}
          >
            <MinusIcon />
          </button>

          <span className="w-8 h-8 flex items-center justify-center">
            {quantity}
          </span>

          <button
            disabled={quantity === product.stock}
            className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
              quantity === product.stock
                ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                : 'bg-slate-100  text-slate-950'
            }`}
            onClick={increaseQuantity}
          >
            <PlusIcon />
          </button>
        </div>

        <button
          onClick={addToCart}
          disabled={quantity === 0}
          className="flex w-full p-2 flex-col justify-center items-center rounded-[6px] border border-slate-400 text-slate-400 hover:bg-slate-50 h-[32px] text-[10px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar al carro
        </button>
      </div>
    </div>
  );
}
