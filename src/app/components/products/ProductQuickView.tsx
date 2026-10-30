"use client";

import { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Product } from "@/interfaces/product.interface";
import { useFavorites } from "@/hooks/useFavorites";
import { useAddToCart } from "@/hooks/useAddToCart";
import {
  QuantitySelector,
  FavoriteButton,
  AddToCartButton,
  ZoomableProductImage,
} from "@/app/components/atoms";

interface Props {
  product: Product;
  onClose: () => void;
}

// Vista ampliada de un producto en un modal: imagen a la izquierda y el nombre completo
// con sus datos y el botón de agregar a la derecha
export default function ProductQuickView({ product, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
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

  // Entrada con transición
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  // Cerrar con Escape o con un click fuera del modal, y bloquear el scroll de fondo
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const categoryPath = [product.category?.name, product.subcategory?.name]
    .filter(Boolean)
    .join(" / ");

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity duration-150 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        data-cy="product-quick-view"
        data-out-of-stock={isOutOfStock}
        className={`relative flex w-full max-w-4xl max-h-[90vh] overflow-y-auto flex-col gap-8 bg-white p-8 rounded-lg shadow-xl sm:flex-row transition-transform duration-150 ease-out ${
          isVisible ? "scale-100" : "scale-[0.97]"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Imagen ampliada */}
        <div className="relative flex items-center justify-center shrink-0 sm:w-[360px]">
          <ZoomableProductImage
            src={product.image}
            alt={product.name}
            className={isOutOfStock ? "grayscale opacity-60" : ""}
          />
          {isOutOfStock && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold uppercase px-2 py-0.5 rounded shadow-sm">
              Agotado
            </span>
          )}
        </div>

        {/* Datos del producto */}
        <div className="flex flex-1 flex-col gap-2 min-w-0">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="flex flex-col gap-1">
              {product.brand?.name && (
                <span className="text-[#64748B] text-sm font-medium">
                  {product.brand.name}
                </span>
              )}
              <h3
                data-cy="product-name"
                className="text-2xl font-semibold leading-snug"
              >
                {product.name}
              </h3>
              {categoryPath && (
                <span className="text-[#64748B] text-xs">{categoryPath}</span>
              )}
            </div>
            <FavoriteButton
              isFavorite={isFavorite(product.id)}
              onToggle={() => toggleFavorite(product.id, product)}
              size="lg"
              variant="grid"
            />
          </div>

          <span
            data-cy="product-price"
            className="text-lime-500 font-bold text-4xl"
          >
            {product.price !== null && product.price !== undefined
              ? product.price.toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })
              : "$0"}
          </span>

          <p className="mt-auto text-sm text-[#64748B]">
            <span className="font-semibold">Unidad:</span>{" "}
            <span className="text-lime-600 font-bold">{product.unit}</span>{" "}
            <span className="font-semibold">|</span>{" "}
            <span className="font-semibold">Stock:</span> {product.stock}{" "}
            <span className="font-semibold">|</span>{" "}
            <span className="font-semibold">SKU:</span> {product.sku}
          </p>

          <div className="flex items-center gap-3 sm:max-w-md">
            <QuantitySelector
              quantity={quantity}
              maxQuantity={maxQuantity}
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
    </div>
  );
}
