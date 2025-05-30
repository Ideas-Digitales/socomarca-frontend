'use client';

import React, { useState, JSX } from 'react';
import {
  CheckCircleIcon,
  PlusIcon,
  GlobeAltIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const socialOptions = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube', 'TikTok'];

const socialIcons: Record<string, JSX.Element> = {
  Facebook: <GlobeAltIcon className="w-5 h-5 text-slate-500" />,
  Instagram: <GlobeAltIcon className="w-5 h-5 text-slate-500" />,
  Twitter: <GlobeAltIcon className="w-5 h-5 text-slate-500" />,
  LinkedIn: <GlobeAltIcon className="w-5 h-5 text-slate-500" />,
  YouTube: <GlobeAltIcon className="w-5 h-5 text-slate-500" />,
  TikTok: <GlobeAltIcon className="w-5 h-5 text-slate-500" />,
};

export default function ContactForm() {
  const [form, setForm] = useState({
    headerPhone: '',
    headerEmail: '',
    footerPhone: '',
    footerEmail: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [socialInputs, setSocialInputs] = useState([{ platform: 'Facebook', url: '' }]);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-() ]+$/;

    if (form.headerEmail && !emailRegex.test(form.headerEmail)) newErrors.headerEmail = 'Correo inválido';
    if (form.footerEmail && !emailRegex.test(form.footerEmail)) newErrors.footerEmail = 'Correo inválido';
    if (form.headerPhone && !phoneRegex.test(form.headerPhone)) newErrors.headerPhone = 'Teléfono inválido';
    if (form.footerPhone && !phoneRegex.test(form.footerPhone)) newErrors.footerPhone = 'Teléfono inválido';

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    // Agregar todas las redes sociales válidas
    const newValidLinks = socialInputs.filter((s) => s.url.startsWith('http'));
    setSocialLinks([...socialLinks, ...newValidLinks]);
    setSocialInputs([{ platform: 'Facebook', url: '' }]); // limpiar
  };

  const updateSocialInput = (index: number, field: 'platform' | 'url', value: string) => {
    const newInputs = [...socialInputs];
    newInputs[index][field] = value;
    setSocialInputs(newInputs);
  };

  const addSocialInput = () => {
    setSocialInputs([...socialInputs, { platform: 'Facebook', url: '' }]);
  };

  const removeSocialInput = (index: number) => {
    const newInputs = [...socialInputs];
    newInputs.splice(index, 1);
    setSocialInputs(newInputs.length ? newInputs : [{ platform: 'Facebook', url: '' }]);
  };

  const inputStyle =
    'w-full mt-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-10">
      <h1 className="text-2xl font-bold text-slate-800">Datos de contacto</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <section>
          <h2 className="text-slate-700 font-semibold mb-3">Header</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircleIcon className="w-4 h-4 text-lime-500" />
                Teléfono de contacto
              </label>
              <input
                className={inputStyle}
                value={form.headerPhone}
                onChange={(e) => setForm({ ...form, headerPhone: e.target.value })}
              />
              {errors.headerPhone && <p className="text-red-500 text-sm">{errors.headerPhone}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircleIcon className="w-4 h-4 text-lime-500" />
                Correo electrónico
              </label>
              <input
                className={inputStyle}
                value={form.headerEmail}
                onChange={(e) => setForm({ ...form, headerEmail: e.target.value })}
              />
              {errors.headerEmail && <p className="text-red-500 text-sm">{errors.headerEmail}</p>}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section>
          <h2 className="text-slate-700 font-semibold mb-3">Footer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircleIcon className="w-4 h-4 text-lime-500" />
                Teléfono de contacto
              </label>
              <input
                className={inputStyle}
                value={form.footerPhone}
                onChange={(e) => setForm({ ...form, footerPhone: e.target.value })}
              />
              {errors.footerPhone && <p className="text-red-500 text-sm">{errors.footerPhone}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircleIcon className="w-4 h-4 text-lime-500" />
                Correo electrónico
              </label>
              <input
                className={inputStyle}
                value={form.footerEmail}
                onChange={(e) => setForm({ ...form, footerEmail: e.target.value })}
              />
              {errors.footerEmail && <p className="text-red-500 text-sm">{errors.footerEmail}</p>}
            </div>
          </div>
        </section>

        {/* Redes Sociales */}
        <section>
          <h2 className="text-slate-700 font-semibold mb-3">Redes sociales</h2>
          {socialInputs.map((social, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 items-center mb-3">
              <select
                value={social.platform}
                onChange={(e) => updateSocialInput(index, 'platform', e.target.value)}
                className="p-2 border border-slate-200 rounded w-full lg:w-40"
              >
                {socialOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className='flex  w-full gap-5'>
              <input
                type="url"
                placeholder="https://..."
                value={social.url}
                onChange={(e) => updateSocialInput(index, 'url', e.target.value)}
                className={`${inputStyle} md:flex-1`}
              />
              <button
                type="button"
                onClick={() => removeSocialInput(index)}
                className="text-red-600 hover:text-red-800"
                title="Eliminar"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSocialInput}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            <PlusIcon className="w-4 h-4" />
            Añadir otra red social
          </button>

          {/* Lista final */}
          {socialLinks.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium text-slate-600">Redes añadidas:</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                {socialLinks.map((link, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {socialIcons[link.platform] || <GlobeAltIcon className="w-5 h-5" />}
                    <span className="font-medium">{link.platform}</span>:
                    <a href={link.url} className="underline" target="_blank" rel="noopener noreferrer">
                      {link.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <div className="flex justify-end gap-4">
          <button type="reset" className="border px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}