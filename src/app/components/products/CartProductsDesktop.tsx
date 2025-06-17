'use client';
import { TrashIcon } from '@heroicons/react/24/outline';
import CartProductsContainer from './CartProductsContainer';
import useStore from '@/stores/base';

export default function CartProductsDesktop() {
  const { clearCart, cartProducts } = useStore();
  const handleEmptyCart = async () => {
    await clearCart();
  };

  return (
    <div className="w-[370px]">
      <div className="flex flex-col w-full py-[10px] px-3 items-start gap-[10px] bg-lime-50 font-semibold text-base">
        Productos agregados en el carro
        {cartProducts.length > 0 && (
          <span
            onClick={handleEmptyCart}
            className="text-lime-500 flex gap-2 items-center cursor-pointer hover:text-lime-700"
          >
            Vaciar carro <TrashIcon width={14} height={14} />{' '}
          </span>
        )}
      </div>
      <CartProductsContainer />
    </div>
  );
}
