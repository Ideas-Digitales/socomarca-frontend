import { Product } from '@/interfaces/product.interface';
import { useEffect, useState } from 'react';
import useStore from '@/stores/base';
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeathIconSolid } from '@heroicons/react/24/solid';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addProductToCart, isQaMode } = useStore();
  const [backgroundImage, setBackgroundImage] = useState(
    `url(${product.imagen})`
  );

  const productStock = 100;

  if (!isQaMode) {
    product.stock = productStock;
    product.price = product.price || 1000;
  }

  useEffect(() => {
    const img = new Image();
    img.src = product.imagen;
    img.onerror = () => {
      setBackgroundImage(`url(/assets/global/logo_plant.png)`);
    };
  }, [product.imagen]);

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
    const maxAllowed = Math.min(product.stock, 999);
    if (quantity >= maxAllowed) {
      return;
    }
    setQuantity(quantity + 1);
  };

  // Nueva función para manejar el cambio en el input
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Permitir campo vacío temporalmente
    if (value === '') {
      setQuantity(0);
      return;
    }

    const numericValue = parseInt(value, 10);

    // Validar que sea un número válido
    if (isNaN(numericValue)) {
      return;
    }

    // Limitar a máximo 999 o stock disponible (el menor de los dos)
    const maxAllowed = Math.min(product.stock, 999);

    if (numericValue > maxAllowed || numericValue < 0) {
      setQuantity(maxAllowed);
    } else {
      setQuantity(numericValue);
    }
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
    <div className="flex p-3 items-center gap-2 bg-white border-b border-slate-300 relative">
      <div className="flex items-center gap-[6px]">
        <div className="rounded-full bg-slate-100 items-center justify-center hidden sm:flex p-[6px]">
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
        <div
          className="w-[37px] h-[70px] py-[15px] px-[37px] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage }}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-1">
        <div className="flex flex-col">
          <span className="text-[#64748B] text-[12px] font-medium">
            {product.brand.name}
          </span>
          <span className="text-[12px] font-medium">
            {truncateText(product.name, 30)}
          </span>
          <span className="text-lime-500 font-bold text-center text-lg mt-1">
            {product.price !== null && product.price !== undefined
              ? product.price.toLocaleString('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                })
              : '$0'}
          </span>
        </div>
        <div className="sm:flex sm:h-[74px] sm:flex-col sm:justify-between sm:items-end sm:gap-[6px] sm:flex-1-0-0 gap-4">
          <p className="text-[#64748B] text-[10px] font-medium my-2">
            <strong>Stock:</strong> {product.stock} <strong>|</strong>{' '}
            <strong>SKU:</strong> {product.sku}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <div className="flex gap-1">
              <button
                disabled={quantity === 0}
                className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
                  quantity === 0
                    ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                    : 'bg-slate-100'
                }`}
                onClick={decreaseQuantity}
              >
                <MinusIcon />
              </button>

              {/* Input de cantidad en lugar del span */}
              <input
                type="number"
                min="0"
                max={Math.min(product.stock, 999)}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-8 h-8 text-center border border-slate-300 rounded-[4px] focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 text-sm mx-0 p-1 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                placeholder="0"
              />

              <button
                disabled={quantity === Math.min(product.stock, 999)}
                className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
                  quantity === Math.min(product.stock, 999)
                    ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                    : 'bg-slate-100'
                }`}
                onClick={increaseQuantity}
              >
                <PlusIcon />
              </button>
            </div>
            <button
              onClick={addToCart}
              disabled={quantity === 0}
              className="flex w-full p-2 flex-col justify-center items-center rounded-[6px] border border-slate-400 text-slate-400 hover:bg-slate-50 h-[32px] text-[12px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:border-lime-500 hover:text-lime-500 transition-all duration-300 ease-in-out"
            >
              Agregar al carro
            </button>
          </div>
        </div>
      </div>
      <div className="sm:hidden rounded-full w-[30px] h-[30px] bg-slate-100 absolute right-[14px] top-[12px] flex items-center justify-center">
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
  );
}
