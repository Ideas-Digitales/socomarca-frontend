import { ProductToBuy } from '@/interfaces/product.interface';
import useStore from '@/stores/useStore';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface Props {
  product: ProductToBuy;
  index: number;
}

export default function CartProductCard({ product, index }: Props) {
  const {
    removeProductFromCart,
    incrementProductInCart,
    decrementProductInCart,
    removeAllQuantityByProductId,
    isQaMode,
  } = useStore();

  if (!isQaMode) {
    product.price = 123123;
    product.brand = {
      brand_id: '1',
      brand_name: 'Brand Name',
    };
  }
  const [backgroundImage, setBackgroundImage] = useState(
    `url(${product.imagen})`
  );

  useEffect(() => {
    // Verificar si la imagen existe
    const img = new Image();
    img.src = product.imagen;
    img.onerror = () => {
      setBackgroundImage(`url(/assets/global/logo_default.png)`);
    };
  }, [product.imagen]);

  const decreaseQuantity = () => {
    if (product.quantity > 0) {
      decrementProductInCart(product.id);
    }

    if (product.quantity === 1) {
      removeProductFromCart(product.id);
    }
  };

  const increaseQuantity = () => {
    if (product.quantity < product.stock) {
      incrementProductInCart(product.id);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const totalPrice = (product.price * product.quantity).toLocaleString(
    'es-CL',
    {
      style: 'currency',
      currency: 'CLP',
    }
  );

  return (
    <div
      className={`flex p-3 items-center gap-2 bg-white border-r border-l border-b border-slate-300 relative ${
        index === 0 && 'border-t'
      } h-[80px]`}
    >
      <div className="flex items-center gap-[6px]">
        <div
          className="w-[45px] h-[46px] p-[2px] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage }}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[#64748B] text-[12px] font-medium">
          {product.brand.brand_name}
        </span>
        <span className="text-[12px] font-medium">
          {truncateText(product.name, 20)}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-1">
        <div className="flex h-[74px] justify-between items-center gap-[6px] flex-1-0-0">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <div className="flex">
              <button
                disabled={product.quantity === 0}
                className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
                  product.quantity === 0
                    ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                    : 'bg-slate-100'
                }`}
                onClick={decreaseQuantity}
              >
                <MinusIcon />
              </button>

              <span className="w-8 h-8 p-1 flex flex-col items-center justify-center">
                {product.quantity}
              </span>

              <button
                disabled={product.quantity === product.stock}
                className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
                  product.quantity === product.stock
                    ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                    : 'bg-slate-100'
                }`}
                onClick={increaseQuantity}
              >
                <PlusIcon />
              </button>
            </div>
            {/* El total quantity * price */}
            <span className="text-[12px] font-bold">{totalPrice}</span>

            <TrashIcon
              className="cursor-pointer"
              onClick={() => removeAllQuantityByProductId(product.id)}
              color="#E11D48"
              width={16}
              height={16}
            />
          </div>
        </div>
      </div>
      <div className="sm:hidden rounded-full w-[30px] h-[30px] bg-slate-100 absolute right-[14px] top-[12px] flex items-center justify-center">
        <TrashIcon color="#E11D48" width={16} height={16} />
      </div>
    </div>
  );
}
