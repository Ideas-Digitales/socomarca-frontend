'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalConfirmacion from '../global/ModalConfirmacion';
import ModalBase from '../global/ModalBase';

export interface ProductoLista {
  nombre: string;
  descripcion?: string;
  marca?: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

export interface ListaFavoritaDetalle {
  nombre: string;
  productos: ProductoLista[];
}

export default function DetalleListaSection({
  lista,
  onVolver,
}: {
  lista: ListaFavoritaDetalle;
  onVolver: () => void;
}) {
  const router = useRouter();
  const [productos, setProductos] = useState(lista.productos);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(
    null
  );
  const [eliminarLista, setEliminarLista] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [nombreEditado, setNombreEditado] = useState(lista.nombre);
  const [errorNombre, setErrorNombre] = useState('');

  const cambiarCantidad = (index: number, cantidad: number) => {
    setProductos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, cantidad } : p))
    );
  };
  // muetra en consola los productos
  console.log(productos);

  const eliminarProducto = (index: number) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-fit">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onVolver}
            className="text-gray-600 hover:underline text-sm"
          >
            ← Volver a favoritos
          </button>

          <div className="flex gap-4 text-sm text-gray-500">
            <button
              onClick={() => {
                setModalEditarVisible(true);
                setNombreEditado(lista.nombre);
              }}
              className="flex items-center gap-1 hover:text-lime-600"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Editar
            </button>

            <button
              onClick={() => {
                setEliminarLista(true);
                setModalVisible(true);
              }}
              className="flex items-center gap-1 hover:text-red-600"
            >
              <TrashIcon className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Productos de {lista.nombre}</h2>

        <div className="space-y-4">
          {productos.map((prod, idx) => (
            <div
              key={idx}
              className="bg-slate-100 flex-col gap-4 justify-start rounded flex items-start sm:items-center sm:flex-row sm:justify-between border border-slate-200 px-4 py-2 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <input type="checkbox" />
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="w-14 h-16 object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/global/logo_plant.png';
                  }}
                />
                <div className="text-sm">
                  <p className="font-semibold">{prod.nombre}</p>
                  <p className="text-gray-500">{prod.descripcion || ''}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-end w-full">
                <div className="flex items-center rounded px-2">
                  <button
                    onClick={() =>
                      cambiarCantidad(idx, Math.max(prod.cantidad - 1, 1))
                    }
                    className="px-2 text-gray-700 bg-white border border-gray-300 rounded"
                  >
                    -
                  </button>
                  <span className="px-2">{prod.cantidad}</span>
                  <button
                    onClick={() => cambiarCantidad(idx, prod.cantidad + 1)}
                    className="px-2 text-gray-700 border border-gray-300 rounded bg-white"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-gray-700">${prod.precio}</span>

                <button
                  onClick={() => {
                    setProductoAEliminar(idx);
                    setModalVisible(true);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push('/carro-de-compra')}
            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
          >
            Agregar al carro
          </button>
        </div>
      </div>
      <ModalConfirmacion
        isOpen={modalVisible}
        titulo={
          eliminarLista ? '¿Eliminar lista completa?' : '¿Eliminar producto?'
        }
        descripcion={
          eliminarLista
            ? 'Esta acción eliminará la lista y todos sus productos.'
            : productoAEliminar !== null 
              ? `"${productos[productoAEliminar]?.nombre}" se quitará de tu lista.`
              : '¿Estás seguro que deseas eliminar este producto?'
        }
        onCancel={() => {
          setModalVisible(false);
          setProductoAEliminar(null);
          setEliminarLista(false);
        }}
        onConfirm={() => {
          if (eliminarLista) {
            // lógica de eliminación de la lista
            router.push('/mi-cuenta?section=favoritos');
          } else if (productoAEliminar !== null) {
            eliminarProducto(productoAEliminar);
          }
          setModalVisible(false);
          setProductoAEliminar(null);
          setEliminarLista(false);
        }}
      />
      <ModalBase
        isOpen={modalEditarVisible}
        title="Editar lista"
        onClose={() => setModalEditarVisible(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!nombreEditado.trim()) {
              setErrorNombre('Este campo es obligatorio');
              return;
            }

            // Aquí puedes actualizar el nombre de la lista en tu store o backend
            console.log('Nuevo nombre:', nombreEditado);
            setModalEditarVisible(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-medium">
              Nombre de lista <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombreEditado}
              onChange={(e) => {
                setNombreEditado(e.target.value);
                setErrorNombre('');
              }}
              className="w-full mt-1 p-2 bg-[#f1f5f9] rounded"
            />
            {errorNombre && (
              <p className="text-red-500 text-sm mt-1">{errorNombre}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setModalEditarVisible(false)}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}