import { CartItem } from '@/interfaces/product.interface';
import useStore from '@/stores/base';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface Props {
  product: CartItem;
  index: number;
}

export default function CartProductCard({ product, index }: Props) {
  const {
    addProductToCart,
    removeAllQuantityByProductId,
    removeProductFromCart,
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState(
    `url(${product.image})`
  );

  useEffect(() => {
    const img = new Image();
    img.src = product.image;
    img.onerror = () => {
      setBackgroundImage(`url(/assets/global/logo_plant.png)`);
    };
  }, [product.image]);

  const decreaseQuantity = async () => {
    setIsLoading(true);
    if (product.quantity > 1) {
      const response = await removeProductFromCart(product);
      if (!response.ok) {
        console.error('Error decrementing product in cart:');
      }

      setIsLoading(false);
    }
  };

  const increaseQuantity = async () => {
    setIsLoading(true);
    if (product.quantity < product.stock) {
      const response = await addProductToCart(product.id, 1, product.unit);
      if (!response.ok) {
        console.error('Error adding product to cart:');
      }
    }
    setIsLoading(false);
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

  const isBrandTruncated = product.brand?.name.length > 10;
  const isNameTruncated = product.name.length > 10;

  return (
    <div
      className={`flex w-full p-3 items-center gap-2 bg-white border-r border-l border-b border-slate-300 relative ${
        index === 0 && 'border-t'
      } h-[80px]`}
    >
      <div className="flex items-center">
        <div
          className="w-[45px] h-[46px] p-[2px] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage }}
        />
      </div>
      <div className="flex flex-col w-full max-w-[80]">
        <span
          className="text-[#64748B] text-[12px] font-medium cursor-help"
          title={isBrandTruncated ? product.brand.name : undefined}
        >
          {truncateText(product.brand.name, 10)}
        </span>
        <span
          className="text-[12px] font-medium cursor-help"
          title={isNameTruncated ? product.name : undefined}
        >
          {truncateText(product.name, 10)}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-1">
        <div className="flex h-[74px] justify-between items-center gap-[6px] flex-1-0-0">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <div className="flex">
              <button
                disabled={product.quantity === 0 || isLoading}
                className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
                  product.quantity === 0
                    ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                    : 'bg-slate-100'
                }`}
                onClick={decreaseQuantity}
              >
                <span className="w-full">-</span>
              </button>

              <span className="w-8 h-8 p-1 flex flex-col items-center justify-center">
                {product.quantity}
              </span>

              <button
                disabled={product.quantity === product.stock || isLoading}
                className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
                  product.quantity === product.stock
                    ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                    : 'bg-slate-100'
                }`}
                onClick={increaseQuantity}
              >
                <span className="w-full">+</span>
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
