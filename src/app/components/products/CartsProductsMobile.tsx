import useStore from '@/stores/base';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CartsProductsMobile() {
  const { cartProducts } = useStore();

  const total = cartProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const itemCount = cartProducts.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);
  return (
    <div className="flex w-full p-3 justify-between items-center fixed bottom-0 bg-slate-100 z-[100] right-0">
      <Link href="/carro-de-compra">
        <ShoppingCartIcon width={24} height={24} />
      </Link>
        <Link href="/carro-de-compra">
      <div className="flex flex-col">
          <span className="text-xs font-medium">
            {itemCount > 1
              ? `[${itemCount}] Productos`
              : `[${itemCount}] Producto`}
          </span>
          <span className="text-2xl font-bold">
            {total.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP',
            })}
          </span>
      </div>
        </Link>
      <Link href="/carro-de-compra">
        <button className="h-[40px] flex justify-center items-center py-3 px-12 bg-lime-500 text-white text-sm rounded-[6px]">
          Pagar
        </button>
      </Link>
    </div>
  );
}
