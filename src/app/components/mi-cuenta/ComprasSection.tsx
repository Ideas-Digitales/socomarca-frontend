"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "@/app/components/global/LoadingSpinner";
import { useState } from "react";
import { addOrderToCart } from "@/services/actions/cart.actions";
import useStore from "@/stores/base";

// Tipos de datos que recibe el componente:

// Representa un producto dentro de una compra
export interface ProductoCompra {
  nombre: string;
  marca: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

// Representa una compra completa realizada por el usuario
export interface Compra {
  fecha: string; // Fecha en que se realizó la compra
  numero: string; // ID de la compra
  hora: string; // Hora en que se registró
  total: number; // Monto total de la compra
  productos: ProductoCompra[]; // Lista de productos comprados
}

export default function ComprasSection({
  compras, // Todas las compras obtenidas desde el backend
  busqueda, // Texto de búsqueda para filtrar por número de pedido
  setBusqueda, // Función para actualizar el texto de búsqueda
  setPedidoSeleccionado, // Función para guardar el pedido seleccionado (para detalle)
  setSelected, // Función para cambiar la vista activa (ej: a 'detalle-compra')
  router, // Next.js router para navegar (ej: para repetir pedido)
  loading, // Booleano que indica si los datos aún están cargando
}: {
  compras: Compra[];
  busqueda: string;
  setBusqueda: (v: string) => void;
  setPedidoSeleccionado: (c: Compra) => void;
  setSelected: (v: string) => void;
  router: any;
  loading: boolean;
}) {
  // Filtra las compras que contienen el número buscado
  const comprasFiltradas = compras.filter((c) =>
    c.numero.includes(busqueda.trim())
  );
  const [repeatingOrderId, setRepeatingOrderId] = useState<string | null>(null);
  const store = useStore.getState();
  return (
    <div className="p-4 rounded">
      <h2 className="text-xl font-bold mb-6">Mis compras</h2>

      {/* Filtro por número de pedido */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        {/* Botón para limpiar búsqueda */}
        <div className="w-[80px]">
          {busqueda.trim() ? (
            <button
              onClick={() => setBusqueda("")}
              className="text-sm text-lime-600 hover:underline"
            >
              Ver todos
            </button>
          ) : (
            <div>&nbsp;</div> // Mantiene el mismo espacio si no hay búsqueda
          )}
        </div>

        {/* Input de búsqueda */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar Nº de pedido"
            className="border border-slate-400 px-4 py-2 rounded w-full pr-10"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {/* Ícono de lupa al lado derecho del input */}
          <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500" />
        </div>
      </div>

      {/* Contenido principal: Loader, lista o mensaje */}
      <div className="space-y-4">
        {loading ? (
          // 🔄 Se muestra mientras se cargan los datos
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : comprasFiltradas.length > 0 ? (
          // ✅ Si hay compras, se muestran
          comprasFiltradas.map((c, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded border-slate-200 border"
            >
              {/* Cabecera con fecha y total */}
              <div className="flex justify-between mb-2 border-b border-b-slate-200 pb-1">
                <span className="font-semibold">{c.fecha}</span>
                <span className="font-bold">
                  ${c.total.toLocaleString("es-CL")}
                </span>
              </div>

              {/* Número de pedido y hora */}
              <p className="text-slate-400 font-medium">Pedido Nº {c.numero}</p>
              <p className="text-sm text-gray-500 mb-2">
                Creado a las {c.hora} hrs.
              </p>

              {/* Galería horizontal de productos */}
              <div className="flex gap-2 overflow-x-auto mb-4">
                {c.productos.map((producto, i) => (
                  <img
                    key={i}
                    src={producto.imagen}
                    alt={producto.nombre}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/global/logo_plant.png";
                    }}
                    className="w-12 h-16 object-contain rounded"
                  />
                ))}
              </div>

              {/* Acciones: Ver detalle o repetir pedido */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPedidoSeleccionado(c); // Guarda el pedido para detalle
                    setSelected("detalle-compra"); // Cambia la vista
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded text-sm"
                >
                  Revisar Detalle
                </button>

                <button
                  onClick={async () => {
                    setRepeatingOrderId(c.numero);

                    const result = await addOrderToCart(Number(c.numero));

                    if (result.ok) {
                      const store = useStore.getState();
                      await store.fetchCartProducts();
                      router.push("/carro-de-compra");
                    } else {
                      alert("Error al repetir pedido: " + result.error);
                    }

                    setRepeatingOrderId(null);
                  }}
                  disabled={repeatingOrderId === c.numero}
                  className={`${
                    repeatingOrderId === c.numero
                      ? "bg-lime-300"
                      : "bg-lime-500 hover:bg-lime-600"
                  } text-white px-4 py-2 rounded text-sm flex items-center justify-center`}
                >
                  {repeatingOrderId === c.numero ? (
                    <span className="text-xs">Procesando...</span>
                  ) : (
                    "Repetir Pedido"
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          // ❌ No hay resultados para mostrar
          <p className="text-center text-gray-500">
            No se encontraron pedidos.
          </p>
        )}
      </div>
    </div>
  );
}
