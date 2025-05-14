import useStore from '@/stores/useStore';
import CartProductCard from './CartProductCard';
export default function CartProductsContainer() {
  const { cartProducts } = useStore();

  return (
    <div className="bg-white w-full max-h-[800px] flex-col items-start p-3">
      {cartProducts.map((product, index) => (
        <CartProductCard key={product.id} product={product} index={index} />
      ))}
      {cartProducts.length === 0 && (
        <div className="flex justify-center items-center h-full ">
          <span className="text-[#64748B] text-[12px] font-medium">
            No hay productos en el carro
          </span>
        </div>
      )}
    </div>
  );
}
