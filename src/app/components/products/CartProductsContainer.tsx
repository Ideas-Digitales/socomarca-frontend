import useStore from '@/stores/useStore';
import CartProductCard from './CartProductCard';
import { useState, useEffect } from 'react';

export default function CartProductsContainer() {
  const { cartProducts } = useStore();
  const [totalPrice, setTotalPrice] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const total = cartProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    const itemCount = cartProducts.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);

    setTotalPrice(
      total.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
      })
    );
    setTotalItems(itemCount);
  }, [cartProducts]);

  return (
    <>
      <div className="bg-white w-full max-h-[800px] overflow-y-auto flex-col items-start p-3">
        {cartProducts.map((product, index) => (
          <CartProductCard key={product.id} product={product} index={index} />
        ))}

        {cartProducts.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <span className="text-[#64748B] text-[12px] font-medium">
              No hay productos en el carro
            </span>
          </div>
        )}
      </div>
      {cartProducts.length > 0 && (
        <div className="w-full bg-amber-50 h-[136px] flex flex-col justify-center items-start">
          <div className="flex w-full p-4 flex-col justify-center items-start gap-1">
            <div className="flex w-full items-center justify-between">
              <span className="text-xs font-semibold w-full">
                Total estimado - {totalItems} artículos
              </span>
              <span className="text-sm font-bold">{totalPrice}</span>
            </div>
            <span className="text-xs text-slate-500">
              Impuestos y envíos calculados al finalizar la compra
            </span>
          </div>
          <div className="w-full p-3">
            <button className="text-white bg-lime-500 w-full py-3 px-12 rounded-[6px]">
              Finalizar compra
            </button>
          </div>
        </div>
      )}
    </>
  );
}
