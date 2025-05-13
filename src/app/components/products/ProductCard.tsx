import { Product } from '@/interfaces/product.interface';
import MinusIcon from '../icons/MinusIcon';
import PlusIcon from '../icons/PlusIcon';
import HearthProductIcon from '../icons/HearthProductIcon';
// import Image from 'next/image';
import { useState } from 'react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [quantity, setQuantity] = useState(0);

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="flex p-3 items-center gap-2 bg-white border-b border-slate-300 relative w-full sm:max-w-[582px] sm:mx-auto">
      <div className="flex items-center gap-[6px]">
        <div className="rounded-full bg-slate-200 items-center justify-center hidden sm:flex p-[6px]">
          <HearthProductIcon />
        </div>
        <div
          className="w-[37px] h-[70px] py-[15px] px-[37px] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${product.imagen})` }}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-1">
        <div className="flex flex-col gap-1">
          <span className="text-[#64748B] text-[12px] font-medium">
            {product.brand}
          </span>
          <span className="text-[12px] font-medium">{product.name}.</span>
          <span className="text-lime-500 font-bold">
            {product.price.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP',
            })}
          </span>
        </div>
        <div className="sm:flex sm:h-[74px] sm:flex-col sm:justify-between sm:items-end sm:gap-[6px] sm:flex-1-0-0 gap-4">
          <p className="text-[#64748B] text-[10px] font-medium my-2">
            <strong>Stock:</strong> {product.stock} <strong>|</strong>{' '}
            <strong>SKU:</strong> {product.sku}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <div className="flex">
              <button
                className="flex w-8 h-8 p-2 justify-between items-center bg-slate-200 rounded-[6px]"
                onClick={decreaseQuantity}
              >
                <MinusIcon />
              </button>

              <span className="w-8 h-8 p-1 flex flex-col items-center justify-center">
                {quantity}
              </span>

              <button
                className="flex w-8 h-8 p-2 justify-between items-center bg-slate-200 rounded-[6px]"
                onClick={increaseQuantity}
              >
                <PlusIcon />
              </button>
            </div>
            <button className="flex w-full sm:w-[120px] p-2 flex-col justify-center items-center rounded-[6px] border border-slate-400 text-slate-400 hover:bg-slate-50 h-[32px] text-[10px]">
              Agregar al carro
            </button>
          </div>
        </div>
      </div>
      <div className="sm:hidden rounded-full w-[30px] h-[30px] bg-slate-200 absolute right-[14px] top-[12px] flex items-center justify-center">
        <HearthProductIcon />
      </div>
    </div>
  );
}
