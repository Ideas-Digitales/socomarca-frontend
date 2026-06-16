'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpTrayIcon, PaintBrushIcon } from '@heroicons/react/24/solid';
import { EyeIcon } from '@heroicons/react/24/outline';
import {
  fetchSendCustomerMessage,
  fetchGetCustomerMessage,
  type BannerSlideData,
} from '@/services/actions/system.actions';

type AdminBannerSlide = BannerSlideData & {
  id: string;
  desktopPreviewUrl?: string;
  mobilePreviewUrl?: string;
};

const createEmptySlide = (): AdminBannerSlide => ({
  id: `slide-${Date.now()}`,
  desktop_image: '',
  mobile_image: '',
  alt: 'Banner principal',
  enabled: true,
});

export default function MensajesCliente() {
  const [modalActivo, setModalActivo] = useState(true);
  const [bannerActivo, setBannerActivo] = useState(true);
  const [headerMensaje, setHeaderMensaje] = useState('');
  const [headerColor, setHeaderColor] = useState('#ffffff');

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const modalInputRef = useRef<HTMLInputElement>(null);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalFileName, setModalFileName] = useState('');
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [bannerSlides, setBannerSlides] = useState<AdminBannerSlide[]>([]);

  const validateFileSize = (file: File): boolean => {
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({
        type: 'error',
        text: `El archivo "${file.name}" excede el tamaño máximo de 15MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      });
      return false;
    }

    return true;
  };

  const cleanupPreviewUrl = (url?: string) => {
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  const loadExistingData = async () => {
    setIsLoadingData(true);

    try {
      const result = await fetchGetCustomerMessage();

      if (result.ok && result.data) {
        const data = result.data;

        setHeaderColor(data.header.color);
        setHeaderMensaje(data.header.content);
        setBannerActivo(data.banner.enabled);
        setModalActivo(data.modal.enabled);
        setBannerSlides(
          data.banner.slides.map((slide) => ({
            ...slide,
            id: slide.id || `slide-${slide.order}`,
            desktopPreviewUrl: slide.desktop_image,
            mobilePreviewUrl: slide.mobile_image,
          }))
        );

        if (data.modal.image) {
          setModalFileName('Imagen modal cargada');
          setModalFile(null);
          setModalImageUrl(data.modal.image);
        }
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Error al cargar los datos existentes',
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error inesperado al cargar los datos' });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadExistingData();
  }, []);

  useEffect(() => {
    return () => {
      cleanupPreviewUrl(modalImageUrl || undefined);
      bannerSlides.forEach((slide) => {
        cleanupPreviewUrl(slide.desktopPreviewUrl);
        cleanupPreviewUrl(slide.mobilePreviewUrl);
      });
    };
  }, []);

  const updateSlide = (id: string, patch: Partial<AdminBannerSlide>) => {
    setBannerSlides((slides) => slides.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)));
  };

  const handleSlideFile = (slide: AdminBannerSlide, file: File, kind: 'desktop' | 'mobile') => {
    if (!validateFileSize(file)) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (kind === 'desktop') {
      cleanupPreviewUrl(slide.desktopPreviewUrl);
      updateSlide(slide.id, { desktop_file: file, desktopPreviewUrl: previewUrl });
    } else {
      cleanupPreviewUrl(slide.mobilePreviewUrl);
      updateSlide(slide.id, { mobile_file: file, mobilePreviewUrl: previewUrl });
    }

    setMessage(null);
  };

  const removeSlide = (id: string) => {
    const slide = bannerSlides.find((item) => item.id === id);
    cleanupPreviewUrl(slide?.desktopPreviewUrl);
    cleanupPreviewUrl(slide?.mobilePreviewUrl);
    setBannerSlides((slides) => slides.filter((item) => item.id !== id));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= bannerSlides.length) {
      return;
    }

    setBannerSlides((slides) => {
      const nextSlides = [...slides];
      [nextSlides[index], nextSlides[nextIndex]] = [nextSlides[nextIndex], nextSlides[index]];
      return nextSlides;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await fetchSendCustomerMessage({
        header_color: headerColor,
        header_content: headerMensaje,
        message_enabled: true,
        banner_enabled: bannerActivo,
        banner_slides: bannerSlides.map((slide, index) => ({
          id: slide.id,
          desktop_image: slide.desktop_image || '',
          mobile_image: slide.mobile_image || '',
          desktop_file: slide.desktop_file,
          mobile_file: slide.mobile_file,
          alt: slide.alt || 'Banner principal',
          order: index + 1,
          enabled: slide.enabled !== false,
        })),
        modal_image: modalFile || undefined,
        modal_enabled: modalActivo,
      });

      setMessage({
        type: result.ok ? 'success' : 'error',
        text: result.ok ? 'Mensajes guardados exitosamente' : result.error || 'Error al guardar los mensajes',
      });
    } catch {
      setMessage({ type: 'error', text: 'Error inesperado al guardar los mensajes' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando configuración de mensajes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Mensajes para el cliente</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors bg-lime-500 hover:bg-lime-600 text-white flex items-center justify-center gap-2"
          >
            <EyeIcon className="w-5 h-5" />
            Ver en el sitio
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-700">Modal</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-1/2">
            <input
              type="file"
              accept="image/*"
              ref={modalInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && validateFileSize(file)) {
                  cleanupPreviewUrl(modalImageUrl || undefined);
                  setModalFile(file);
                  setModalFileName(file.name);
                  setModalImageUrl(URL.createObjectURL(file));
                  setMessage(null);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => modalInputRef.current?.click()}
              className="flex items-center gap-2 justify-center sm:justify-start border w-full rounded px-4 py-2 text-sm"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Subir imagen
            </button>
            {modalFileName && <p className="text-xs text-gray-500 mt-1 truncate">{modalFileName}</p>}
            {modalImageUrl && <img src={modalImageUrl} alt="Imagen modal actual" className="mt-2 max-h-24 rounded border" />}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name="modal" checked={modalActivo} onChange={() => setModalActivo(true)} />
              Activar
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name="modal" checked={!modalActivo} onChange={() => setModalActivo(false)} />
              Desactivar
            </label>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Resolución recomendada: <strong>620x400 px</strong>. Peso máximo por imagen: <strong>15 MB</strong>.
        </p>
      </section>

      <section className="bg-slate-50 p-4 rounded space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-700">Banner principal</h2>
          <button
            type="button"
            onClick={() => setBannerSlides((slides) => [...slides, createEmptySlide()])}
            className="w-full sm:w-auto border border-lime-500 text-lime-700 rounded px-4 py-2 text-sm hover:bg-lime-50"
          >
            Agregar slide
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" name="banner" checked={bannerActivo} onChange={() => setBannerActivo(true)} />
            Activar
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" name="banner" checked={!bannerActivo} onChange={() => setBannerActivo(false)} />
            Desactivar
          </label>
        </div>

        {bannerSlides.length === 0 && (
          <div className="rounded border border-dashed border-slate-300 p-6 text-sm text-slate-500 text-center">
            No hay slides configurados. Agregá uno para mostrar el banner del catálogo.
          </div>
        )}

        <div className="space-y-4">
          {bannerSlides.map((slide, index) => (
            <article key={slide.id} className="rounded border bg-white p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="font-medium text-slate-700">Slide {index + 1}</h3>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0} className="border rounded px-3 py-1 text-xs disabled:opacity-40">Subir</button>
                  <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === bannerSlides.length - 1} className="border rounded px-3 py-1 text-xs disabled:opacity-40">Bajar</button>
                  <button type="button" onClick={() => removeSlide(slide.id)} className="border border-red-200 text-red-600 rounded px-3 py-1 text-xs">Eliminar</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-600">Imagen desktop</span>
                  <input type="file" accept="image/*" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleSlideFile(slide, file, 'desktop');
                  }} />
                  {slide.desktopPreviewUrl && <img src={slide.desktopPreviewUrl} alt="Preview desktop" className="max-h-28 rounded border" />}
                </label>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-600">Imagen responsiva</span>
                  <input type="file" accept="image/*" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleSlideFile(slide, file, 'mobile');
                  }} />
                  {slide.mobilePreviewUrl && <img src={slide.mobilePreviewUrl} alt="Preview móvil" className="max-h-28 rounded border" />}
                </label>
              </div>

              <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-600">Texto alternativo</span>
                  <input
                    type="text"
                    value={slide.alt || ''}
                    onChange={(event) => updateSlide(slide.id, { alt: event.target.value })}
                    className="w-full rounded border px-3 py-2 text-sm"
                    placeholder="Descripción del banner"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm min-h-10">
                  <input
                    type="checkbox"
                    checked={slide.enabled !== false}
                    onChange={(event) => updateSlide(slide.id, { enabled: event.target.checked })}
                  />
                  Slide activo
                </label>
              </div>
            </article>
          ))}
        </div>

        <p className="text-sm text-gray-600">
          Resolución recomendada: <strong>1500 x 400 px</strong> para desktop y <strong>750 x 400 px</strong> para responsivo. Peso máximo por imagen: <strong>15 MB</strong>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">Mensaje en el header</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <textarea
            placeholder="Ingresar el mensaje de su preferencia"
            value={headerMensaje}
            onChange={(e) => setHeaderMensaje(e.target.value)}
            className="p-4 border rounded text-sm h-24"
          />
          <div className="space-y-2">
            <label className="block text-sm">Seleccionar color de fondo</label>
            <div className="flex items-center gap-2">
              <input type="color" value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              <PaintBrushIcon className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
