import { Product } from '@/interfaces/product.interface';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
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
  onExpand: () => void;
}

export default function ProductCard({ product, onExpand }: Props) {
  const { addProductToCartOptimistic, isQaMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimisticUpdate, setIsOptimisticUpdate] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);

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
    if (quantity > 1) {
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
    if (quantity <= 0 || isOutOfStock) return;

    setIsLoading(true);

    if (isQaMode) {
      setIsOptimisticUpdate(true);
      setTimeout(() => {
        setQuantity(1);
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
        setQuantity(1);
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
  const isOutOfStock = product.stock <= 0;

  const quickViewButton = (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`Ver detalle de ${product.name}`}
      title="Ver detalle"
      data-cy="product-quick-view-btn"
      className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-100 p-[6px] text-[#475569] hover:text-lime-600 cursor-pointer"
    >
      <MagnifyingGlassPlusIcon width={16} height={16} />
    </button>
  );

  return (
    <div
      data-cy="product-card"
      data-out-of-stock={isOutOfStock}
      className="flex p-3 items-center gap-2 bg-white border-b border-slate-300 relative"
    >
      <div className="flex items-center gap-[6px]">
        <div className="hidden sm:flex flex-col gap-1.5">
          <FavoriteButton
            isFavorite={isProductFavorite}
            onToggle={handleSetFavorite}
            size="md"
            variant="default"
          />
          {quickViewButton}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={onExpand}
            aria-label={`Ver ${product.name}`}
            className="block cursor-pointer"
          >
            <ProductImage
              src={product.image}
              alt={product.name}
              variant="list"
              className={isOutOfStock ? 'grayscale opacity-60' : ''}
            />
          </button>
          {isOutOfStock && (
            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
              Agotado
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-1 min-w-0">
        <ProductInfo
          brand={product.brand}
          name={product.name}
          price={product.price}
          unit={product.unit}
          variant="list"
          onNameClick={onExpand}
        />
        <div className="sm:flex sm:h-[74px] sm:flex-col sm:justify-between sm:items-end sm:gap-[6px] sm:flex-1-0-0 gap-4">
          <p className="text-[#64748B] text-[10px] font-medium my-2 text-left">
            <strong>Unidad:</strong>{' '}
            <span className="text-lime-600 font-bold">{product.unit}</span>{' '}
            <strong>|</strong> <strong>Stock:</strong> {product.stock}{' '}
            <strong>|</strong> <strong>SKU:</strong> {product.sku}
          </p>
          <div className="flex flex-row justify-center items-center gap-3">
            <QuantitySelector
              quantity={quantity}
              maxQuantity={Math.min(product.stock, 999)}
              onDecrease={decreaseQuantity}
              onIncrease={increaseQuantity}
              onChange={handleQuantityChange}
              disabled={isLoading || isOutOfStock}
              size="md"
            />
            <AddToCartButton
              onClick={addToCart}
              disabled={quantity === 0 || isOutOfStock}
              isLoading={isLoading}
              isSuccess={isOptimisticUpdate}
              quantity={quantity}
              variant="full-width"
              size="md"
            />
          </div>
        </div>
      </div>
      <div className="sm:hidden absolute right-[14px] top-[12px] flex flex-col gap-1.5">
        <FavoriteButton
          isFavorite={isProductFavorite}
          onToggle={handleSetFavorite}
          size="md"
          variant="default"
        />
        {quickViewButton}
      </div>
    </div>
  );
}
