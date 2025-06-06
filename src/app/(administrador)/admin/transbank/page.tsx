'use client';

import { useState } from 'react';

export default function CredencialesTransbank() {
  const [form, setForm] = useState({
    commerceCode: '',
    apiKey: '',
    callbackUrl: '',
    environment: 'integration',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Aquí puedes hacer una solicitud POST o guardar en localStorage
    console.log('Guardando credenciales Transbank:', form);
    alert('Credenciales guardadas');
  };

  return (
    <div className="bg-[#f5f9fc] p-6 rounded-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Credenciales de Transbank</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Código de Comercio</label>
          <input
            type="text"
            name="commerceCode"
            value={form.commerceCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded border-gray-300 bg-white"
            placeholder="Ej: 597055555532"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">API Key Privada</label>
          <input
            type="text"
            name="apiKey"
            value={form.apiKey}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded border-gray-300  bg-white"
            placeholder="Llave privada entregada por Transbank"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Ambiente</label>
          <select
            name="environment"
            value={form.environment}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded border-gray-300  bg-white"
          >
            <option value="integration">Integración</option>
            <option value="production">Producción</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">URL de Notificación</label>
          <input
            type="url"
            name="callbackUrl"
            value={form.callbackUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded border-gray-300  bg-white"
            placeholder="https://tuweb.cl/webpay/callback"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-[#87c814] text-white px-6 py-2 rounded hover:bg-[#76b40e] transition"
        >
          Guardar credenciales
        </button>
      </div>
    </div>
  );
}
