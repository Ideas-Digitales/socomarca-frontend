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
    addProductToCartOptimistic,
    removeProductFromCartOptimistic,
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState(
    `url(${product.image})`
  );  useEffect(() => {
    const img = new Image();
    img.src = product.image;
    img.onerror = () => {
      setBackgroundImage(`url(/assets/global/logo_plant.png)`);
    };
  }, [product.image]);  const decreaseQuantity = async () => {
    setIsLoading(true);
    
    if (product.quantity > 1) {
      try {
        const response = await removeProductFromCartOptimistic(product, 1);
        if (!response.ok) {
          console.error('Error decrementing product in cart:');
        }
      } catch (error) {
        console.error('Error decrementing product:', error);
      }
    }
    setIsLoading(false);
  };  const increaseQuantity = async () => {
    setIsLoading(true);
    
    if (product.quantity < product.stock) {
      try {
        const response = await addProductToCartOptimistic(product.id, 1, product.unit, product);
        if (!response.ok) {
          console.error('Error adding product to cart:');
        }
      } catch (error) {
        console.error('Error adding product:', error);
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
  const deleteAllQuantity = async () => {
    setIsLoading(true);
    
    try {
      const response = await removeProductFromCartOptimistic(product, product.quantity);
      if (!response.ok) {
        console.error('Error removing all quantity of product from cart:');
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
    setIsLoading(false);
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

  // Condiciones para deshabilitar botones
  const isDecreaseDisabled = product.quantity <= 1 || isLoading;
  const isIncreaseDisabled = product.quantity >= product.stock || isLoading;

  return (
    <div
      className={`flex w-full min-w-0 p-3 items-center gap-2 bg-white border-r border-l border-b border-slate-300 relative ${
        index === 0 && 'border-t'
      } h-[80px]`}
    >
      {/* Imagen del producto - fijo */}
      <div className="flex-shrink-0">
        <div
          className="w-[45px] h-[46px] p-[2px] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage }}
        />
      </div>
      
      {/* Información del producto - flexible con truncado */}
      <div className="flex flex-col min-w-0 flex-shrink-0 w-[80px]">
        <span
          className="text-[#64748B] text-[12px] font-medium cursor-help truncate"
          title={isBrandTruncated ? product.brand.name : undefined}
        >
          {truncateText(product.brand.name, 10)}
        </span>
        <span
          className="text-[12px] font-medium cursor-help truncate"
          title={isNameTruncated ? product.name : undefined}
        >
          {truncateText(product.name, 10)}
        </span>
      </div>
      
      {/* Controles y precio - flexible */}
      <div className="flex flex-1 min-w-0 justify-end items-center gap-2">        {/* Controles de cantidad */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            disabled={isDecreaseDisabled}
            className={`flex w-7 h-7 justify-center items-center rounded-[6px] transition-all duration-200 ${
              isDecreaseDisabled
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700'
            }`}
            onClick={decreaseQuantity}
          >
            <span className="text-sm">-</span>
          </button>

          <span className="w-6 h-7 flex items-center justify-center text-xs font-medium">
            {product.quantity}
          </span>

          <button
            disabled={isIncreaseDisabled}
            className={`flex w-7 h-7 justify-center items-center rounded-[6px] transition-all duration-200 ${
              isIncreaseDisabled
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700'
            }`}
            onClick={increaseQuantity}
          >
            <span className="text-sm">+</span>
          </button>
        </div>
        
        {/* Precio - con ancho máximo */}
        <div className="flex items-center justify-end min-w-0 max-w-[80px]">
          <span className="text-[11px] font-bold truncate" title={totalPrice}>
            {totalPrice}
          </span>
        </div>        {/* Icono de eliminar - fijo */}
        <div className="flex-shrink-0">
          <TrashIcon
            className={`transition-all duration-200 ${
              isLoading 
                ? 'cursor-not-allowed opacity-50' 
                : 'cursor-pointer hover:text-red-600'
            }`}
            onClick={isLoading ? undefined : deleteAllQuantity}
            color="#E11D48"
            width={14}
            height={14}
          />
        </div>
      </div>
    </div>
  );
}