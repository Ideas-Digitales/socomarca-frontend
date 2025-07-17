'use client';

import { useState, useEffect } from 'react';
import { fetchGetWebpayConfig, fetchUpdateWebpayConfig, WebpayConfig } from '@/services/actions/transbank.actions';

export default function CredencialesTransbank() {
  const [form, setForm] = useState<WebpayConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchGetWebpayConfig()
      .then((result) => {
        if (result.ok && result.data) {
          setForm(result.data);
          console.log('Webpay config:', result.data);
        } else {
          setError(result.error || 'No se pudo cargar la configuración de Transbank');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('No se pudo cargar la configuración de Transbank');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    if (!form) return;
    const errors: Record<string, string> = {};
    if (!form.WEBPAY_COMMERCE_CODE?.trim()) errors.WEBPAY_COMMERCE_CODE = 'El código de comercio es requerido';
    if (!form.WEBPAY_API_KEY?.trim()) errors.WEBPAY_API_KEY = 'La API Key es requerida';
    if (!form.WEBPAY_ENVIRONMENT?.trim()) errors.WEBPAY_ENVIRONMENT = 'El ambiente es requerido';
    if (!form.WEBPAY_RETURN_URL?.trim()) errors.WEBPAY_RETURN_URL = 'La URL de notificación es requerida';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSaveMsg('Completa todos los campos requeridos');
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    const result = await fetchUpdateWebpayConfig(form);
    if (result.ok) {
      setSaveMsg('¡Credenciales guardadas correctamente!');
    } else {
      setSaveMsg(result.error || 'Error al guardar credenciales');
    }
    setSaving(false);
  };

  return (
    <div className="bg-[#f5f9fc] p-6 rounded-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Credenciales de Transbank</h2>
      {loading ? (
        <div className="text-center py-8">Cargando...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : form ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div>
            <label className="block font-medium mb-1">Código de Comercio</label>
            <input
              type="text"
              name="WEBPAY_COMMERCE_CODE"
              value={form.WEBPAY_COMMERCE_CODE}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded border-gray-300 bg-white ${fieldErrors.WEBPAY_COMMERCE_CODE ? 'border-red-400' : ''}`}
            />
            {fieldErrors.WEBPAY_COMMERCE_CODE && (
              <div className="text-red-500 text-sm mt-1">{fieldErrors.WEBPAY_COMMERCE_CODE}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">API Key Privada</label>
            <input
              type="text"
              name="WEBPAY_API_KEY"
              value={form.WEBPAY_API_KEY}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded border-gray-300 bg-white ${fieldErrors.WEBPAY_API_KEY ? 'border-red-400' : ''}`}
            />
            {fieldErrors.WEBPAY_API_KEY && (
              <div className="text-red-500 text-sm mt-1">{fieldErrors.WEBPAY_API_KEY}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Ambiente</label>
            <select
              name="WEBPAY_ENVIRONMENT"
              value={form.WEBPAY_ENVIRONMENT}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded border-gray-300 bg-white ${fieldErrors.WEBPAY_ENVIRONMENT ? 'border-red-400' : ''}`}
            >
              <option value="integration">Integración</option>
              <option value="production">Producción</option>
            </select>
            {fieldErrors.WEBPAY_ENVIRONMENT && (
              <div className="text-red-500 text-sm mt-1">{fieldErrors.WEBPAY_ENVIRONMENT}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">URL de Notificación</label>
            <input
              type="url"
              name="WEBPAY_RETURN_URL"
              value={form.WEBPAY_RETURN_URL}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded border-gray-300 bg-white ${fieldErrors.WEBPAY_RETURN_URL ? 'border-red-400' : ''}`}
            />
            {fieldErrors.WEBPAY_RETURN_URL && (
              <div className="text-red-500 text-sm mt-1">{fieldErrors.WEBPAY_RETURN_URL}</div>
            )}
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className={`bg-lime-500 text-white px-6 py-2 rounded transition ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          {saveMsg && (
            <div className={`mt-2 text-center ${saveMsg.startsWith('¡') ? 'text-green-600' : 'text-red-500'}`}>{saveMsg}</div>
          )}
        </form>
      ) : null}
    </div>
  );
}
