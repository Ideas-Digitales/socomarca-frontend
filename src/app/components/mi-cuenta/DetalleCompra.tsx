'use client';
import { useRouter } from 'next/navigation';
import { Compra } from './ComprasSection';

export default function DetalleCompra({
  pedido,
}: {
  pedido: Compra;
}) {
  const router = useRouter();

  return (
    <div className="bg-[#f1f5f9] p-4 rounded min-h-screen">
      <h2 className="text-lg font-bold mb-2">Pedido Nº {pedido.numero}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Pedido entregado el {pedido.fecha}
      </p>
      <p className="text-green-600 font-medium mb-6">
        {pedido.productos.length} Productos
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {pedido.productos.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={p.imagen}
                  className="w-14 h-16 object-contain"
                  alt={p.nombre}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/global/logo_default.png';
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-500">{p.marca}</p>
                  <p className="font-semibold">{p.nombre}</p>
                  <p className="text-green-600 font-bold">${p.precio}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Cant: {p.cantidad}</p>
                <p className="font-semibold text-gray-800">${p.precio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded shadow h-fit">
          <h3 className="text-lg font-bold mb-4">Resumen de compra</h3>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm">${pedido.total}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2 mb-2">
            <span>Total todo medio de pago</span>
            <span>${pedido.total}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Impuestos y envíos calculados al finalizar la compra
          </p>
          <button
            onClick={() => router.push('/carro-de-compra')}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded"
          >
            Continuar con la compra
          </button>
        </div>
      </div>
    </div>
  );
}
