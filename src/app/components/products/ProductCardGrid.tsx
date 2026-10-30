'use client';

import { Product } from '@/interfaces/product.interface';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { useFavorites } from '@/hooks/useFavorites';
import { useAddToCart } from '@/hooks/useAddToCart';
import {
  QuantitySelector,
  FavoriteButton,
  AddToCartButton,
  ProductImage,
} from '@/app/components/atoms';

interface Props {
  product: Product;
  onExpand: () => void;
}

export default function ProductCardGrid({ product, onExpand }: Props) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const {
    quantity,
    maxQuantity,
    isLoading,
    isOptimisticUpdate,
    isOutOfStock,
    decreaseQuantity,
    increaseQuantity,
    handleQuantityChange,
    addToCart,
  } = useAddToCart(product);

  const handleSetFavorite = async () => {
    await toggleFavorite(product.id, product);
  };

  const isProductFavorite = isFavorite(product.id);

  return (
    <div
      data-cy="product-card"
      data-out-of-stock={isOutOfStock}
      className="flex p-3 items-center flex-col justify-between gap-2 bg-white w-full max-w-[220px] min-h-[350px] border-b-slate-200 border-b relative"
    >
      {/* Imagen del producto */}
      <div className="flex items-center justify-center h-[100px] w-full relative">
        <button
          type="button"
          onClick={onExpand}
          aria-label={`Ver ${product.name}`}
          className="w-full cursor-pointer"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            variant="grid"
            className={isOutOfStock ? 'grayscale opacity-60' : ''}
          />
        </button>
        {/* Botón de vista ampliada y badge de sin stock */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
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
          {isOutOfStock && (
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
              Agotado
            </span>
          )}
        </div>
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
          {product.brand?.name}
        </span>
        <button
          type="button"
          data-cy="product-name"
          onClick={onExpand}
          className="text-sm font-medium text-center leading-tight min-h-[34px] line-clamp-2 cursor-pointer hover:text-lime-600"
          title={product.name}
        >
          {product.name}
        </button>
        <span data-cy="product-price" className="text-lime-500 font-bold text-center text-lg mt-1">
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
            <span className="font-semibold">Unidad:</span>{' '}
            <span className="text-lime-600 font-bold">{product.unit}</span>
          </p>
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
            maxQuantity={maxQuantity}
            onDecrease={decreaseQuantity}
            onIncrease={increaseQuantity}
            onChange={handleQuantityChange}
            disabled={isLoading || isOutOfStock}
            size="md"
          />
        </div>

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
  );
}
