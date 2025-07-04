/**
 * Subcomponentes para el carrito de compras
 */
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { BUTTON_STYLES } from './constants';

// Estilos configurables
const STYLES = {
  button: BUTTON_STYLES
} as const;

interface ProductImageProps {
  src: string;
  alt: string;
  backgroundImage: string;
}

export const ProductImage = ({ backgroundImage, alt }: ProductImageProps) => (
  <div
    className="w-12 h-16 p-[2px] bg-contain bg-no-repeat bg-center"
    style={{ backgroundImage }}
    role="img"
    aria-label={alt}
  />
);

interface ProductInfoProps {
  brandName: string;
  productName: string;
  isBrandTruncated: boolean;
  isNameTruncated: boolean;
  truncateText: (text: string) => string;
}

export const ProductInfo = ({ 
  brandName, 
  productName, 
  isBrandTruncated, 
  isNameTruncated, 
  truncateText 
}: ProductInfoProps) => (
  <div>
    <p
      className="text-xs text-slate-400 cursor-help"
      title={isBrandTruncated ? brandName : undefined}
    >
      {isBrandTruncated ? truncateText(brandName) : brandName}
    </p>
    <p
      data-cy="cart-item-name"
      className="text-black text-xs cursor-help"
      title={isNameTruncated ? productName : undefined}
    >
      {isNameTruncated ? truncateText(productName) : productName}
    </p>
  </div>
);

interface QuantityControlsProps {
  quantity: number;
  stock: number;
  isLoading: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  productId: number;
}

export const QuantityControls = ({ 
  quantity, 
  stock, 
  isLoading, 
  onIncrease, 
  onDecrease,
  productId 
}: QuantityControlsProps) => {
  const isDecreaseDisabled = quantity <= 1 || isLoading;
  const isIncreaseDisabled = quantity >= stock || isLoading;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        data-cy="decrease-quantity-btn"
        disabled={isDecreaseDisabled}
        className={`${STYLES.button.base} ${
          isDecreaseDisabled ? STYLES.button.disabled : STYLES.button.enabled
        }`}
        onClick={onDecrease}
        aria-label={`Disminuir cantidad del producto`}
        data-testid={`decrease-quantity-${productId}`}
      >
        <MinusIcon className="w-4 h-4" aria-hidden="true" />
      </button>
      
      <span 
        data-cy="cart-item-quantity"
        className="w-8 text-center font-medium"
        aria-label={`Cantidad: ${quantity}`}
      >
        {quantity}
      </span>
      
      <button
        data-cy="increase-quantity-btn"
        disabled={isIncreaseDisabled}
        className={`${STYLES.button.base} ${
          isIncreaseDisabled ? STYLES.button.disabled : STYLES.button.enabled
        }`}
        onClick={onIncrease}
        aria-label={`Aumentar cantidad del producto`}
        data-testid={`increase-quantity-${productId}`}
      >
        <PlusIcon className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

interface PriceAndDeleteProps {
  totalPrice: string;
  onDelete: () => void;
  isLoading: boolean;
  productId: number;
}

export const PriceAndDelete = ({ 
  totalPrice, 
  onDelete, 
  isLoading,
  productId 
}: PriceAndDeleteProps) => (
  <div className="flex flex-row justify-between items-center">
    <span data-cy="cart-item-price" className="font-bold text-gray-700">{totalPrice}</span>
    <button
      data-cy="delete-product-btn"
      onClick={onDelete}
      disabled={isLoading}
      className={`text-red-500 transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-700'
      }`}
      aria-label="Eliminar producto del carrito"
      data-testid={`delete-product-${productId}`}
    >
      <TrashIcon className="w-5 h-5" aria-hidden="true" />
    </button>
  </div>
);
