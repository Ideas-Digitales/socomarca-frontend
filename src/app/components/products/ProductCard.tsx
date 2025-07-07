import { Product } from '@/interfaces/product.interface';
import { useEffect, useState } from 'react';
import useStore from '@/stores/base';
import { useFavorites } from '@/hooks/useFavorites';
import {
  QuantitySelector,
  FavoriteButton,
  AddToCartButton,
  ProductImage,
  ProductInfo,
} from '@/app/components/atoms';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addProductToCartOptimistic, isQaMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimisticUpdate, setIsOptimisticUpdate] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(0);

  const handleSetFavorite = async () => {
    await toggleFavorite(product.id, product);
  };

  useEffect(() => {
    if (isOptimisticUpdate && !isLoading) {
      const timer = setTimeout(() => {
        setIsOptimisticUpdate(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOptimisticUpdate, isLoading]);

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
      setIsOptimisticUpdate(true);
      setTimeout(() => {
        setQuantity(0);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      setIsOptimisticUpdate(true);

      const response = await addProductToCartOptimistic(
        product.id,
        quantity,
        product.unit,
        product
      );

      if (response.ok) {
        setQuantity(0);
      } else {
        setIsOptimisticUpdate(false);
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
    <div data-cy="product-card" className="flex p-3 items-center gap-2 bg-white border-b border-slate-300 relative">
      <div className="flex items-center gap-[6px]">
        <div className="hidden sm:flex">
          <FavoriteButton
            isFavorite={isProductFavorite}
            onToggle={handleSetFavorite}
            size="md"
            variant="default"
          />
        </div>
        <ProductImage src={product.image} alt={product.name} variant="list" />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-1">
        <ProductInfo
          brand={product.brand}
          name={product.name}
          price={product.price}
          variant="list"
        />
        <div className="sm:flex sm:h-[74px] sm:flex-col sm:justify-between sm:items-end sm:gap-[6px] sm:flex-1-0-0 gap-4">
          <p className="text-[#64748B] text-[10px] font-medium my-2 text-center sm:text-left">
            <strong>Stock:</strong> {product.stock} <strong>|</strong>{' '}
            <strong>SKU:</strong> {product.sku}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <QuantitySelector
              quantity={quantity}
              maxQuantity={Math.min(product.stock, 999)}
              onDecrease={decreaseQuantity}
              onIncrease={increaseQuantity}
              onChange={handleQuantityChange}
              disabled={isLoading}
              size="md"
            />
            <AddToCartButton
              onClick={addToCart}
              disabled={quantity === 0}
              isLoading={isLoading}
              isSuccess={isOptimisticUpdate}
              quantity={quantity}
              variant="full-width"
              size="md"
            />
          </div>
        </div>
      </div>
      <div className="sm:hidden absolute right-[14px] top-[12px]">
        <FavoriteButton
          isFavorite={isProductFavorite}
          onToggle={handleSetFavorite}
          size="md"
          variant="default"
        />
      </div>
    </div>
  );
}
