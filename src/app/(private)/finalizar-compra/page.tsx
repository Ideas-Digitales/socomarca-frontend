'use client';
import { useState } from 'react';

export default function FinalizarCompraPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
    detallesDireccion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Formulario de facturación */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Datos de facturación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Texto*</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Rut*</label>
              <input
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Correo electrónico*</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Teléfono*</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Región*</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-gray-100"
              >
                <option value="">Selecciona una región</option>
                <option value="RM">Región Metropolitana</option>
                <option value="V">Valparaíso</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Comuna*</label>
              <select
                name="comuna"
                value={formData.comuna}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-gray-100"
              >
                <option value="">Selecciona una comuna</option>
                <option value="Santiago">Santiago</option>
                <option value="La Serena">La Serena</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Dirección*</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Detalles de la dirección</label>
              <input
                type="text"
                name="detallesDireccion"
                value={formData.detallesDireccion}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Resumen de la orden */}
        <aside className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Tu Orden</h3>

          <div className="flex justify-between text-green-600 mb-2">
            <a href="#" className="underline">
              Productos (19)
            </a>
            <span>$29.583</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Subtotal</span>
            <span>$29.583</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Costos de envío</span>
            <span>$3.000</span>
          </div>
          <div className="flex justify-between font-bold text-lg my-3">
            <span>Total a pagar</span>
            <span>$32.583</span>
          </div>

          <div className="mb-4">
            <p className="font-bold">Pagar con Webpay (Tarjeta de Crédito y Débito)</p>
            <img src="/img/webpay.png" alt="Webpay" className="my-2 w-full max-w-xs" />
            <p className="text-sm text-gray-600">
              Pagar con Redcompra<br />
              Serás redirigido al portal de WebPay
            </p>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <input type="radio" name="acepta" id="acepta" className="mr-2" />
            Todos los derechos reservados tankandtrailco.cl<br />
            Al comprar aceptas los <a href="#" className="text-green-600 underline">términos y condiciones</a> de tankandtrailco.cl
          </div>

          <button className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded">
            Finalizar compra
          </button>
        </aside>
      </div>
    </div>
  );
}
