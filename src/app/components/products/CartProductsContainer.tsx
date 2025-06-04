'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CartProductCard from './CartProductCard';
import { fetchGetCart } from '@/services/actions/cart.actions';

interface ProductInCart {
  id: number;
  product_id: number;
  quantity: number;
  price: string;
  subtotal: number;
}

export default function CartProductsContainer() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const response = await fetchGetCart();
      if (response.ok && response.data) {
        const enriched = response.data.items.map((item) => ({
          id: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
          stock: 100, // mock
          name: `Producto #${item.product_id}`,
          sku: `SKU-${item.product_id}`,
          imagen: '/placeholder.png',
          brand: { name: 'Marca' },
          category: { name: 'Categoría' },
          subtotal: item.subtotal,
        }));
        setProducts(enriched);
      }
      setLoading(false);
    };

    loadCart();
  }, []);

  useEffect(() => {
    const total = products.reduce((acc, product) => {
      return acc + Number(product.subtotal);
    }, 0);

    const itemCount = products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);

    setTotalPrice(
      total.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
      })
    );
    setTotalItems(itemCount);
  }, [products]);

  return (
    <>
      <div className="bg-white w-full max-h-[800px] overflow-y-auto flex-col items-start p-3">
        {loading ? (
          <div className="text-sm text-slate-500">Cargando...</div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <CartProductCard
              key={product.id + '-' + index}
              product={product}
              index={index}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <span className="text-[#64748B] text-[12px] font-medium">
              No hay productos en el carro
            </span>
          </div>
        )}
      </div>

      {products.length > 0 && (
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
            <Link href="/carro-de-compra">
              <button className="text-white bg-lime-500 w-full py-3 px-12 rounded-[6px] cursor-pointer">
                Finalizar compra
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
