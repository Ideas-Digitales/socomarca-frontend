'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export interface ProductoCompra {
  nombre: string;
  marca: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

export interface Compra {
  fecha: string;
  numero: string;
  hora: string;
  total: number;
  productos: ProductoCompra[];
}

export default function ComprasSection({
  compras,
  busqueda,
  setBusqueda,
  setPedidoSeleccionado,
  setSelected,
  router,
}: {
  compras: Compra[];
  busqueda: string;
  setBusqueda: (v: string) => void;
  setPedidoSeleccionado: (c: Compra) => void;
  setSelected: (v: string) => void;
  router: any;
}) {
  const comprasFiltradas = compras.filter((c) =>
    c.numero.includes(busqueda.trim())
  );

  return (
    <div className="p-4 rounded">
      <h2 className="text-xl font-bold mb-6">Mis compras</h2>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
  <div className="w-[80px]">
    {busqueda.trim() ? (
      <button
        onClick={() => setBusqueda('')}
        className="text-sm text-lime-600 hover:underline"
      >
        Ver todos
      </button>
    ) : (
      <div>&nbsp;</div> // espacio en blanco del mismo tamaño
    )}
  </div>

  <div className="relative w-full md:w-72">
    <input
      type="text"
      placeholder="Buscar Nº de pedido"
      className="border border-slate-400 px-4 py-2 rounded w-full pr-10"
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />
    <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500" />
  </div>
</div>


      <div className="space-y-4">
        {comprasFiltradas.length > 0 ? (
          comprasFiltradas.map((c, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded border-slate-200 border"
            >
              <div className="flex justify-between mb-2 border-b border-b-slate-200 pb-1">
                <span className="font-semibold">{c.fecha}</span>
                <span className="font-bold">
                  ${c.total.toLocaleString('es-CL')}
                </span>
              </div>

              <p className="text-slate-400 font-medium">
                Pedido Nº {c.numero}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Entregado a las {c.hora} hrs.
              </p>

              <div className="flex gap-2 overflow-x-auto mb-4">
                {c.productos.map((producto, i) => (
                  <img
                    key={i}
                    src={producto.imagen}
                    alt={producto.nombre}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/global/logo_plant.png';
                    }}
                    className="w-12 h-16 object-contain rounded"
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPedidoSeleccionado(c);
                    setSelected('detalle-compra');
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded text-sm"
                >
                  Revisar Detalle
                </button>

                <button
                  onClick={() => router.push('/carro-de-compra')}
                  className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded text-sm"
                >
                  Repetir Pedido
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No se encontraron pedidos.
          </p>
        )}
      </div>
    </div>
  );
}
