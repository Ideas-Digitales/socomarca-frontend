// app/(mi-cuenta)/page.tsx
'use client';
import { useState } from 'react';
import Sidebar from '@/app/components/mi-cuenta/Sidebar';

export default function MiCuentaPage() {
  const [selected, setSelected] = useState('datos');

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
  <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Hola, Damary</h1>
      <div className="flex gap-6">
        <Sidebar selectedKey={selected} onSelect={setSelected} />

        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {selected === 'datos' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Datos personales</h2>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium">Nombre</label>
                  <input className="w-full mt-1 p-2 bg-gray-100 rounded" />
                </div>
                <div>
                  <label className="block font-medium">Primer apellido</label>
                  <input className="w-full mt-1 p-2 bg-gray-100 rounded" />
                </div>
                <div>
                  <label className="block font-medium">Segundo apellido</label>
                  <input className="w-full mt-1 p-2 bg-gray-100 rounded" />
                </div>
                <div>
                  <label className="block font-medium">Correo electrónico</label>
                  <input type="email" className="w-full mt-1 p-2 bg-gray-100 rounded" />
                </div>
                <div>
                  <label className="block font-medium">Teléfono</label>
                  <input type="tel" className="w-full mt-1 p-2 bg-gray-100 rounded" />
                </div>
                <div>
                  <label className="block font-medium">RUT</label>
                  <input className="w-full mt-1 p-2 bg-gray-100 rounded" />
                </div>
                <div className="md:col-span-3 mt-4">
                  <button type="submit" className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          )}

          {selected === 'direcciones' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Direcciones</h2>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <span></span>
                    <span>Nombre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm">✏️</button>
                    <button className="text-sm">🗑️</button>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <span></span>
                    <span>Nombre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm">✏️</button>
                    <button className="text-sm">🗑️</button>
                  </div>
                </div>
              </div>
              <button className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded">
                Agregar nueva dirección
              </button>
            </div>
          )}

          {selected === 'favoritos' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Mis favoritos</h2>
              <div className="space-y-4 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded p-4 bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">SM medium</h3>
                        <p className="text-sm text-gray-500">[X] Productos</p>
                      </div>
                      <button className="text-blue-600 text-sm flex items-center gap-1">
                        Revisar lista ➜
                      </button>
                    </div>
                    <div className="mt-2 flex gap-2 overflow-x-auto">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="w-12 h-16 bg-gray-100 rounded" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded">
                Crear nueva lista
              </button>
            </div>
          )}

          {selected === 'compras' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Mis compras</h2>
              <div className="flex justify-end mb-4">
                <input
                  type="text"
                  placeholder="Buscar Nº de pedido"
                  className="border px-4 py-2 rounded w-64"
                />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b py-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">2 de diciembre</span>
                    <span className="font-bold">$999.999</span>
                  </div>
                  <p className="text-blue-600 font-medium">Pedido Nº 123456789</p>
                  <p className="text-sm text-gray-500 mb-2">Entregado a las 15:56 hrs.</p>
                  <div className="flex gap-2 mb-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="w-12 h-16 bg-gray-100 rounded" />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded text-sm">
                      Revisar Detalle
                    </button>
                    <button className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded text-sm">
                      Repetir Pedido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selected === 'logout' && <p>Has cerrado sesión.</p>}
        </div>
      </div>
    </div>
    </div>
  );
}
