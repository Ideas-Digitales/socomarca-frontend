'use client';

import { Product } from '@/interfaces/product.interface';
import { useEffect, useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useFavorites } from '@/hooks/useFavorites';
import { fetchPostAddToCart } from '@/services/actions/cart.actions';

interface Props {
  product: Product;
}

export default function ProductCardGrid({ product }: Props) {
  const { isFavorite, toggleFavorite, handleAddToList } = useFavorites();
  const [quantity, setQuantity] = useState(0);
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

  const handleSetFavorite = () => {
    if (isFavorite(product.id)) {
      toggleFavorite(product.id);
    } else {
      handleAddToList(product);
    }
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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setQuantity(0);
      return;
    }

    const numericValue = parseInt(value, 10);

    if (isNaN(numericValue)) {
      return;
    }

    const maxAllowed = Math.min(product.stock, 999);

    if (numericValue > maxAllowed || numericValue < 0) {
      setQuantity(maxAllowed);
    } else {
      setQuantity(numericValue);
    }
  };

  const addToCart = async () => {
    console.log('Añadiendo al carrito:', product.id, quantity, product.unit );
    if (quantity > 0) {
      const response = await fetchPostAddToCart({
        product_id: product.id,
        quantity,
        unit: 'kg',
      });

      if (response.ok) {
        console.log('Producto añadido al carrito:', response.data);
        // Aquí podrías mostrar un toast, actualizar el estado global del carrito, etc.
        setQuantity(0);
      } else {
        console.error('Error al añadir al carrito:', response.error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const isProductFavorite = isFavorite(product.id);

  return (
    <div className="flex p-3 items-center flex-col justify-between gap-2 bg-white w-full max-w-[220px] h-[350px] border-b-slate-200 border-b relative">
      {/* Imagen del producto */}
      <div className="flex items-center justify-center h-[100px] w-full relative">
        <div
          className="w-full bg-contain bg-no-repeat bg-center h-[87px]"
          style={{ backgroundImage }}
        />

        {/* Botón de favorito */}
        <div className="rounded-full bg-slate-100 items-center justify-center flex p-[6px] absolute top-2 right-2">
          {!isProductFavorite ? (
            <HeartIcon
              className="cursor-pointer"
              color="#475569"
              width={16}
              height={16}
              onClick={handleSetFavorite}
            />
          ) : (
            <HeartIconSolid
              className="cursor-pointer"
              color="#ef4444"
              width={16}
              height={16}
              onClick={handleSetFavorite}
            />
          )}
        </div>
      </div>

      {/* Información del producto */}
      <div className="flex flex-col w-full items-center">
        <span className="text-[#64748B] text-xs font-medium">
          {product.brand.name}
        </span>
        <span className="text-sm font-medium text-center">
          {truncateText(product.name, 25)}
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
        <div className="flex items-center justify-center gap-1">
          <button
            disabled={quantity === 0}
            className={`flex w-8 h-8 p-2 justify-between items-center rounded-[6px] cursor-pointer ${
              quantity === 0
                ? 'bg-slate-200 opacity-50 cursor-not-allowed'
                : 'bg-slate-100 text-slate-950'
            }`}
            onClick={decreaseQuantity}
          >
            -
          </button>

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
                : 'bg-slate-100  text-slate-950'
            }`}
            onClick={increaseQuantity}
          >
            +
          </button>
        </div>

        <button
          onClick={addToCart}
          disabled={quantity === 0}
          className="flex w-full p-2 flex-col justify-center items-center rounded-[6px] bg-[#84CC16] text-white hover:bg-[#257f00] h-[32px] text-[12px] cursor-pointer  disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
        >
          Agregar al carro 2
        </button>
      </div>
    </div>
  );
}
