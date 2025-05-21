'use client';
import { useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import useStore from '@/stores/base';
import CarroCompraCard from '@/app/components/carro-de-compra/CarroCompraCard';
import CarroCompraCardMobile from '@/app/components/carro-de-compra/CarroCompraCardMobile';

export default function CarroDeCompraPage() {
  const router = useRouter();
  const {
    cartProducts,
    removeAllQuantityByProductId,
    decrementProductInCart,
    incrementProductInCart,
  } = useStore();

  const backHome = () => {
    router.push('/');
  };

  const goNext = () => {
    router.push('/finalizar-compra');
  };

  const [idProductoAEliminar, setIdProductoAEliminar] = useState<number | null>(
    null
  );

  const subtotal = cartProducts.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );
  function goBack() {
    router.back();
  }
  return (
    <div className="w-full bg-slate-100 min-h-screen p-4">
      <div>
        {cartProducts.length === 0 || !cartProducts ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <img
              src="assets/global/logo_plant.png"
              alt="Logo"
              className="w-24 h-24 mb-6"
            />
            <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-4">
              Agrega productos a tu carrito para comenzar a comprar.
            </p>
            <button
              onClick={backHome}
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded cursor-pointer"
            >
              Ir a la tienda
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Sección del carrito */}
            <div className="w-full lg:w-3/4 bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3">
                <ChevronLeftIcon
                  className="w-5 h-5 mb-4 font-bold lg:hidden"
                  strokeWidth={3}
                  onClick={goBack}
                />
                <h2 className="text-2xl font-bold mb-4 ">
                  Carro{' '}
                  <span className="text-lime-500 text-base font-normal">
                    ({cartProducts.length} productos)
                  </span>
                </h2>
              </div>

              {/* Tabla para pantallas grandes */}
              <div className="hidden lg:block overflow-x-auto">
                <div className="max-h-[60dvh] overflow-y-auto">
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border border-slate-100 bg-slate-50 font-semibold text-gray-600 text-left">
                        <th className="p-4 text-center font-semibold text-black">
                          Producto
                        </th>
                        <th className="p-4 text-center font-semibold text-black">
                          Cantidad
                        </th>
                        <th className="p-4 text-center font-semibold text-black">
                          Precio
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartProducts.map((p) => (
                        <CarroCompraCard
                          decrementProductInCart={decrementProductInCart}
                          incrementProductInCart={incrementProductInCart}
                          key={p.id}
                          p={p}
                          setIdProductoAEliminar={setIdProductoAEliminar}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Layout en tarjetas para móviles */}
              <div className="lg:hidden flex flex-col gap-4 max-h-[60dvh] overflow-y-auto">
                {cartProducts.map((p) => (
                  <CarroCompraCardMobile
                    decrementProductInCart={decrementProductInCart}
                    incrementProductInCart={incrementProductInCart}
                    p={p}
                    key={p.id}
                    setIdProductoAEliminar={setIdProductoAEliminar}
                  />
                ))}
              </div>

              <div className="mt-6">
                <button
                  className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded cursor-pointer hidden lg:block"
                  onClick={backHome}
                >
                  Seguir comprando
                </button>
              </div>
            </div>

            {/* Sección del resumen */}
            <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow p-6 h-fit">
              <div className="border-b-[1px] border-b-slate-100 pb-2 mb-3">
                <h3 className="text-xl font-bold border-b-slate-50">
                  Resumen de compra
                </h3>
              </div>
              <div className="flex justify-between mb-2 pb-3 border-b-[1px] border-b-slate-100">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between font-bold mb-2">
                <span>Total todo medio de pago</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Impuestos y envíos calculados al finalizar la compra
              </p>

              <button
                onClick={goNext}
                disabled={cartProducts.length === 0}
                className={`w-full ${
                  cartProducts.length > 0
                    ? 'bg-lime-500 hover:bg-lime-600'
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white py-2 rounded`}
              >
                Continuar con la compra
              </button>
            </aside>

            {/* Modal de confirmación para eliminar */}
            {idProductoAEliminar !== null && (
              <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-120 shadow-lg">
                  <h4 className="text-lg font-bold mb-2">Eliminar producto</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    ¿Estás seguro que deseas eliminar este producto del carrito?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIdProductoAEliminar(null)}
                      className="px-4 py-2 text-sm rounded hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        removeAllQuantityByProductId(idProductoAEliminar);
                        setIdProductoAEliminar(null);
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
