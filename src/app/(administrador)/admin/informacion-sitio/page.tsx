'use client';

import React, { useState, JSX, useEffect } from 'react';
import {
  CheckCircleIcon,
  PlusIcon,
  GlobeAltIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import useStore from '@/stores/base';
import { SiteInformation } from '@/interfaces/siteInformation.interface';

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
  const {
    siteInformation,
    isLoadingSiteInfo,
    isUpdatingSiteInfo,
    siteInfoError,
    fetchSiteInformation,
    updateSiteInformation,
    clearSiteInfoError
  } = useStore();

  const [form, setForm] = useState({
    headerPhone: '',
    headerEmail: '',
    footerPhone: '',
    footerEmail: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [socialInputs, setSocialInputs] = useState([{ platform: 'Facebook', url: '' }]);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchSiteInformation();
  }, [fetchSiteInformation]);

  // Actualizar formulario cuando se cargan los datos
  useEffect(() => {
    if (siteInformation) {
      setForm({
        headerPhone: siteInformation.header.contact_phone || '',
        headerEmail: siteInformation.header.contact_email || '',
        footerPhone: siteInformation.footer.contact_phone || '',
        footerEmail: siteInformation.footer.contact_email || '',
      });

      // Convertir las redes sociales del backend al formato del formulario
      const convertedSocialLinks = siteInformation.social_media.map((social: any) => ({
        platform: social.label.charAt(0).toUpperCase() + social.label.slice(1),
        url: social.link
      }));
      setSocialLinks(convertedSocialLinks);
    }
  }, [siteInformation]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearSiteInfoError();
    setSuccessMessage('');

    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    // Agregar todas las redes sociales válidas
    const newValidLinks = socialInputs.filter((s) => s.url.startsWith('http'));
    const allSocialLinks = [...socialLinks, ...newValidLinks];

    // Preparar datos para enviar al backend
    const siteInfoData: SiteInformation = {
      header: {
        contact_phone: form.headerPhone,
        contact_email: form.headerEmail
      },
      footer: {
        contact_phone: form.footerPhone,
        contact_email: form.footerEmail
      },
      social_media: allSocialLinks.map(link => ({
        label: link.platform.toLowerCase(),
        link: link.url
      }))
    };

    // Enviar al backend
    const result = await updateSiteInformation(siteInfoData);
    
    if (result.success) {
      setSuccessMessage('Información actualizada correctamente');
      setSocialLinks(allSocialLinks);
      setSocialInputs([{ platform: 'Facebook', url: '' }]);
    } else {
      setErrors({ submit: result.error || 'Error al actualizar' });
    }
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

  if (isLoadingSiteInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <div className="flex items-center justify-center h-32">
          <div className="text-slate-600">Cargando información del sitio...</div>
        </div>
      </div>
    );
  }

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

        {/* Mensajes de error y éxito */}
        {siteInfoError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {siteInfoError}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button 
            type="reset" 
            className="border px-4 py-2 rounded hover:bg-slate-50"
            onClick={() => {
              if (siteInformation) {
                setForm({
                  headerPhone: siteInformation.header.contact_phone || '',
                  headerEmail: siteInformation.header.contact_email || '',
                  footerPhone: siteInformation.footer.contact_phone || '',
                  footerEmail: siteInformation.footer.contact_email || '',
                });
                const convertedSocialLinks = siteInformation.social_media.map((social: any) => ({
                  platform: social.label.charAt(0).toUpperCase() + social.label.slice(1),
                  url: social.link
                }));
                setSocialLinks(convertedSocialLinks);
                setSocialInputs([{ platform: 'Facebook', url: '' }]);
              }
              setErrors({});
              setSuccessMessage('');
              clearSiteInfoError();
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUpdatingSiteInfo}
            className={`px-4 py-2 rounded text-white ${
              isUpdatingSiteInfo 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-lime-500 hover:bg-lime-600'
            }`}
          >
            {isUpdatingSiteInfo ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}