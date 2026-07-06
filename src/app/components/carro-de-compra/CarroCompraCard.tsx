/**
 * Componente de tarjeta de producto para el carrito de compras.
 * Renderiza una fila de tabla con controles de cantidad y eliminación.
 */
import { CartItem } from '@/interfaces/product.interface';
import { useCartItem } from '@/hooks/useCartItem';
import { ProductImage, ProductInfo, QuantityControls, PriceAndDelete } from './CartComponents';

/**
 * Props del componente CarroCompraCard
 */
interface CartCardProps {
  /** Producto del carrito */
  product: CartItem;
  /** Callback opcional cuando cambia la cantidad */
  onQuantityChange?: (productId: number, unit: string, newQuantity: number) => void;
  /** Callback opcional cuando se elimina el producto */
  onRemove?: (productId: number, unit: string) => void;
}

/**
 * Componente que renderiza una fila del carrito de compras.
 * Incluye imagen, información del producto, controles de cantidad y eliminación.
 */
export default function CarroCompraCard({ product }: CartCardProps) {
  const {
    isLoading,
    backgroundImage,
    totalPrice,
    decreaseQuantity,
    increaseQuantity,
    deleteAllQuantity,
  } = useCartItem(product);

  return (
    <tr data-cy="cart-item" key={`${product.id}-${product.unit}`} className="border border-slate-100">
      {/* Información del producto */}
      <td className="px-4 py-4 flex items-center gap-4">
        <ProductImage
          src={product.image}
          alt={`Imagen de ${product.name}`}
          backgroundImage={backgroundImage}
        />
        <ProductInfo
          brandName={product.brand?.name || 'Sin marca'}
          productName={product.name}
        />
        <span className="text-xs font-semibold text-lime-600 ml-2 uppercase">
          {product.unit}
        </span>
      </td>

      {/* Controles de cantidad */}
      <td className="p-4 text-center">
        <QuantityControls
          quantity={product.quantity}
          stock={product.stock}
          isLoading={isLoading}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          productId={product.id}
          unit={product.unit}
        />
      </td>

      {/* Precio y eliminación */}
      <td className="p-4 text-right">
        <PriceAndDelete
          totalPrice={totalPrice}
          onDelete={deleteAllQuantity}
          isLoading={isLoading}
          productId={product.id}
        />
      </td>
    </tr>
  );
}
