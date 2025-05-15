"use client";
import { useState } from "react";
import { TrashIcon, ChevronLeftIcon} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Producto {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export default function CarroDeCompraPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 0,
      nombre: "Arroz granel laminado",
      marca: "Miraflores",
      precio: 1390,
      cantidad: 1,
      imagen: "/img/arroz.png",
    },
    {
      id: 1,
      nombre: "Fideos espagueti 500g",
      marca: "Carozzi",
      precio: 890,
      cantidad: 1,
      imagen: "/img/fideos.png",
    },
    {
      id: 2,
      nombre: "Aceite vegetal 1L",
      marca: "Miraflores",
      precio: 2290,
      cantidad: 1,
      imagen: "/img/aceite.png",
    },
    {
      id: 3,
      nombre: "Azúcar granulada 1kg",
      marca: "Iansa",
      precio: 1190,
      cantidad: 1,
      imagen: "/img/azucar.png",
    },
    {
      id: 4,
      nombre: "Sal fina 1kg",
      marca: "Lobos",
      precio: 450,
      cantidad: 1,
      imagen: "/img/sal.png",
    },
  ]);

  const backHome = () => {
    router.push("/");
  };

  const goNext = () => {
    router.push("/finalizar-compra")
  }

  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(
    null
  );
  const eliminarProducto = () => {
    if (productoAEliminar) {
      setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar.id));
      setProductoAEliminar(null);
    }
  };

  const cambiarCantidad = (id: number, delta: number) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === id
          ? {
              ...producto,
              cantidad: Math.max(1, producto.cantidad + delta),
            }
          : producto
      )
    );
  };

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  function goBack() {
    router.back();
  }

  return (
    <div className="w-full bg-slate-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Sección del carrito */}
        <div className="w-full lg:w-3/4 bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3">
          <ChevronLeftIcon  className="w-5 h-5 mb-4 font-bold lg:hidden" strokeWidth={3} onClick={goBack}/> 
          <h2 className="text-2xl font-bold mb-4 ">
             Carro{" "}
            <span className="text-lime-500 text-base font-normal">
              ({productos.length} productos)
            </span>
          </h2>
        </div>
      

          {/* Tabla para pantallas grandes */}
<div className="hidden lg:block overflow-x-auto">
  <table className="min-w-full text-sm">
    <thead>
      <tr className="border border-slate-100 bg-slate-50 font-semibold text-gray-600 text-left">
        <th className="p-4 text-center font-semibold text-black">Producto</th>
        <th className="p-4 text-center font-semibold text-black">Cantidad</th>
        <th className="p-4 text-center font-semibold text-black">Precio</th>
      </tr>
    </thead>
    <tbody>
      {productos.map((p) => (
        <tr key={p.id} className="border border-slate-100">
          <td className="px-4 py-2 flex items-center gap-4">
            <img
              src={p.imagen}
              alt={p.nombre}
              className="w-12 h-16 object-contain rounded"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = "/assets/global/logo_plant.png";
                target.classList.add("grayscale", "opacity-50");
              }}
            />
            <div>
              <p className="text-xs text-slate-400">{p.marca}</p>
              <p className="text-black text-xs">{p.nombre}</p>
            </div>
          </td>
          <td className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => cambiarCantidad(p.id, -1)} className="px-2 py-1 bg-gray-200 rounded">−</button>
              <span className="w-8 text-center">{p.cantidad}</span>
              <button onClick={() => cambiarCantidad(p.id, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
          </td>
          <td className="p-4 text-right font-bold text-gray-700">
            <div className="flex flex-row justify-between">
              <span>${(p.precio * p.cantidad).toLocaleString("es-CL")}</span>
              <button onClick={() => setProductoAEliminar(p)} className="text-black hover:cursor-pointer hover:text-red-500" title="Eliminar producto">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Layout en tarjetas para móviles */}
<div className="lg:hidden flex flex-col gap-4">
  {productos.map((p) => (
    <div key={p.id} className="relative flex gap-4 bg-white p-4 border-b border-b-slate-200">
      {/* Botón eliminar arriba a la derecha */}
      <button
        onClick={() => setProductoAEliminar(p)}
        className="absolute top-2 right-2 text-black hover:text-red-500"
        title="Eliminar producto"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      <img
        src={p.imagen}
        alt={p.nombre}
        className="w-16 h-20 object-contain rounded"
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = "/assets/global/logo_plant.png";
          target.classList.add("grayscale", "opacity-50");
        }}
      />

      <div className="flex-1 pr-6">
        <p className="text-xs text-slate-400">{p.marca}</p>
        <p className="text-sm font-semibold text-black">{p.nombre}</p>
        <p className="text-sm font-bold text-gray-700 mt-1">
          ${(p.precio * p.cantidad).toLocaleString("es-CL")}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => cambiarCantidad(p.id, -1)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            −
          </button>
          <span className="w-6 text-center">{p.cantidad}</span>
          <button
            onClick={() => cambiarCantidad(p.id, 1)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  ))}
</div>



          <div className="mt-6">
            <button
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded hidden lg:block"
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
            <span>${subtotal.toLocaleString("es-CL")}</span>
          </div>
          <div className="flex justify-between font-bold mb-2">
            <span>Total todo medio de pago</span>
            <span>${subtotal.toLocaleString("es-CL")}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Impuestos y envíos calculados al finalizar la compra
          </p>

          <button onClick={goNext} className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded">
            Continuar con la compra
          </button>
        </aside>
        {productoAEliminar && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-120 shadow-lg">
              <h4 className="text-lg font-bold mb-2">Eliminar producto</h4>
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro que deseas eliminar{" "}
                <strong>{productoAEliminar.nombre}</strong> del carrito?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setProductoAEliminar(null)}
                  className="px-4 py-2 text-sm rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarProducto}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
