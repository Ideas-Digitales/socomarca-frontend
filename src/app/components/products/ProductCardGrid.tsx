'use client';

import { Product } from '@/interfaces/product.interface';
import { useEffect, useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import useStore from '@/stores/base';
import {
  QuantitySelector,
  FavoriteButton,
  AddToCartButton,
  ProductImage,
} from '@/app/components/atoms';

interface Props {
  product: Product;
}

export default function ProductCardGrid({ product }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addProductToCartOptimistic, isQaMode } = useStore();
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimisticUpdate, setIsOptimisticUpdate] = useState(false);

  // Efecto para manejar el feedback visual del optimistic update
  useEffect(() => {
    if (isOptimisticUpdate && !isLoading) {
      const timer = setTimeout(() => {
        setIsOptimisticUpdate(false);
      }, 1500); // Mostrar "✓ Agregado" por 1.5 segundos

      return () => clearTimeout(timer);
    }
  }, [isOptimisticUpdate, isLoading]);

  const handleSetFavorite = async () => {
    await toggleFavorite(product.id, product);
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
    if (quantity <= 0) return;

    setIsLoading(true);

    if (isQaMode) {
      setQuantity(0);
      setIsLoading(false);
      return;
    }

    try {
      // Establecer estado optimista inmediatamente
      setIsOptimisticUpdate(true);

      const response = await addProductToCartOptimistic(
        product.id,
        quantity,
        product.unit,
        product
      );

      if (response.ok) {
        setQuantity(0);
        // El estado isOptimisticUpdate se mantendrá true hasta que el useEffect lo resetee
      } else {
        // Si falla, quitar el estado optimista inmediatamente
        setIsOptimisticUpdate(false);
        console.error('Error adding product to cart');
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      setIsOptimisticUpdate(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isProductFavorite = isFavorite(product.id);

  return (
    <div className="flex p-3 items-center flex-col justify-between gap-2 bg-white w-full max-w-[220px] h-[350px] border-b-slate-200 border-b relative">
      {/* Imagen del producto */}
      <div className="flex items-center justify-center h-[100px] w-full relative">
        <ProductImage src={product.image} alt={product.name} variant="grid" />
        {/* Botón de favorito */}
        <div className="absolute top-2 right-2">
          <FavoriteButton
            isFavorite={isProductFavorite}
            onToggle={handleSetFavorite}
            size="md"
            variant="grid"
          />
        </div>
      </div>

      {/* Información del producto */}
      <div className="flex flex-col w-full items-center">
        <span className="text-[#64748B] text-xs font-medium">
          {product.brand.name}
        </span>
        <span className="text-sm font-medium text-center">
          {product.name.length > 25
            ? product.name.substring(0, 25) + '...'
            : product.name}
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
          <QuantitySelector
            quantity={quantity}
            maxQuantity={Math.min(product.stock, 999)}
            onDecrease={decreaseQuantity}
            onIncrease={increaseQuantity}
            onChange={handleQuantityChange}
            disabled={isLoading}
            size="md"
          />
        </div>

        <AddToCartButton
          onClick={addToCart}
          disabled={quantity === 0 || product.stock === 0}
          isLoading={isLoading}
          isSuccess={isOptimisticUpdate}
          quantity={quantity}
          variant="full-width"
          size="md"
        />
      </div>
    </div>
  );
}
