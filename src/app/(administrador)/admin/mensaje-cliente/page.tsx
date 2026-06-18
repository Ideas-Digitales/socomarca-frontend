'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpTrayIcon, PhotoIcon, PaintBrushIcon } from '@heroicons/react/24/solid';
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
  desktopError?: string;
  mobileError?: string;
};

const MAX_IMAGE_SIZE_MB = 15;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1000 * 1000;
const BannerImageHelpText = () => (
  <>
    Resolución recomendada: <strong>1500 x 400 px</strong> para desktop y <strong>750 x 400 px</strong> para responsivo. Peso máximo por imagen: 15 MB.
  </>
);

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

  const getFileSizeError = (file: File): string | null => {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return `El archivo "${file.name}" excede el tamaño máximo de ${MAX_IMAGE_SIZE_MB} MB. Tamaño actual: ${(file.size / 1000 / 1000).toFixed(2)} MB.`;
    }

    return null;
  };

  const validateFileSize = (file: File): boolean => {
    const error = getFileSizeError(file);

    if (error) {
      setMessage({ type: 'error', text: error });
      return false;
    }

    return true;
  };

  const clearFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = '';
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
    const sizeError = getFileSizeError(file);

    if (sizeError) {
      updateSlide(slide.id, kind === 'desktop' ? { desktopError: sizeError } : { mobileError: sizeError });
      setMessage({ type: 'error', text: sizeError });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (kind === 'desktop') {
      cleanupPreviewUrl(slide.desktopPreviewUrl);
      updateSlide(slide.id, { desktop_file: file, desktopPreviewUrl: previewUrl, desktopError: undefined });
    } else {
      cleanupPreviewUrl(slide.mobilePreviewUrl);
      updateSlide(slide.id, { mobile_file: file, mobilePreviewUrl: previewUrl, mobileError: undefined });
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
    const oversizedSlideFile = bannerSlides
      .flatMap((slide) => [slide.desktop_file, slide.mobile_file])
      .find((file): file is File => !!file && !!getFileSizeError(file));

    if (oversizedSlideFile || (modalFile && getFileSizeError(modalFile))) {
      validateFileSize(oversizedSlideFile ?? modalFile!);
      return;
    }

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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mensajes para el cliente</h1>
          <p className="mt-1 text-sm text-slate-500">Configurá el banner del catálogo, el modal y el mensaje superior del sitio.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center justify-center gap-2"
          >
            <EyeIcon className="w-5 h-5" />
            Ver en el sitio
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {message.text}
        </div>
      )}

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Modal de bienvenida</h2>
          <p className="text-sm text-slate-500">Imagen que se muestra al ingresar al sitio.</p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-5">
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
                } else {
                  clearFileInput(e);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => modalInputRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Subir imagen
            </button>
            {modalFileName && <p className="text-xs text-gray-500 mt-1 truncate">{modalFileName}</p>}
            {modalImageUrl && <img src={modalImageUrl} alt="Imagen modal actual" className="mt-3 h-28 w-full rounded-md border border-gray-200 object-contain bg-gray-50" />}
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="modal" checked={modalActivo} onChange={() => setModalActivo(true)} />
              Activar
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="modal" checked={!modalActivo} onChange={() => setModalActivo(false)} />
              Desactivar
            </label>
          </div>
        </div>
        <p className="text-sm text-gray-600 bg-lime-50 border border-lime-200 rounded-lg p-3">
          Resolución recomendada: <strong>620x400 px</strong>. Peso máximo por imagen: <strong>15 MB</strong>.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Banner principal</h2>
            <p className="text-sm text-slate-500">Administrá los slides que se muestran en el catálogo.</p>
          </div>
          <button
            type="button"
            onClick={() => setBannerSlides((slides) => [...slides, createEmptySlide()])}
            className="w-full sm:w-auto border border-lime-500 text-lime-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-lime-50 transition-colors"
          >
            Agregar slide
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-700">Estado del banner</span>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="banner" checked={bannerActivo} onChange={() => setBannerActivo(true)} />
            Activar
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="banner" checked={!bannerActivo} onChange={() => setBannerActivo(false)} />
            Desactivar
          </label>
        </div>

        {bannerSlides.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <PhotoIcon className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-700">No hay slides configurados</p>
            <p className="mt-1 text-sm text-slate-500">Agregá uno para mostrar el banner del catálogo.</p>
          </div>
        )}

        <div className="space-y-4">
          {bannerSlides.map((slide, index) => (
            <article key={slide.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-100 text-xs font-semibold text-lime-700">{index + 1}</span>
                  <h3 className="font-medium text-slate-800">Slide {index + 1}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">Subir</button>
                  <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === bannerSlides.length - 1} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">Bajar</button>
                  <button type="button" onClick={() => removeSlide(slide.id)} className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Eliminar</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-600">Imagen desktop</span>
                  <input className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 file:cursor-pointer" type="file" accept="image/*" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      handleSlideFile(slide, file, 'desktop');
                      if (getFileSizeError(file)) clearFileInput(event);
                    }
                  }} />
                  <p className="text-xs leading-5 text-slate-500"><BannerImageHelpText /></p>
                  <div className="flex h-28 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white">
                    {slide.desktopPreviewUrl ? <img src={slide.desktopPreviewUrl} alt="Preview desktop" className="h-full w-full object-contain" /> : <PhotoIcon className="h-8 w-8 text-slate-300" />}
                  </div>
                  {slide.desktopError && <p className="text-xs leading-5 text-red-600">{slide.desktopError}</p>}
                </label>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-600">Imagen responsiva</span>
                  <input className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 file:cursor-pointer" type="file" accept="image/*" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      handleSlideFile(slide, file, 'mobile');
                      if (getFileSizeError(file)) clearFileInput(event);
                    }
                  }} />
                  <p className="text-xs leading-5 text-slate-500"><BannerImageHelpText /></p>
                  <div className="flex h-28 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white">
                    {slide.mobilePreviewUrl ? <img src={slide.mobilePreviewUrl} alt="Preview móvil" className="h-full w-full object-contain" /> : <PhotoIcon className="h-8 w-8 text-slate-300" />}
                  </div>
                  {slide.mobileError && <p className="text-xs leading-5 text-red-600">{slide.mobileError}</p>}
                </label>
              </div>

              <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-600">Texto alternativo</span>
                  <input
                    type="text"
                    value={slide.alt || ''}
                    onChange={(event) => updateSlide(slide.id, { alt: event.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="Descripción del banner"
                  />
                </label>
                <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-slate-700 border border-gray-200 min-h-10">
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

        <p className="text-sm text-gray-600 bg-lime-50 border border-lime-200 rounded-lg p-3"><BannerImageHelpText /></p>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Mensaje en el header</h2>
          <p className="text-sm text-slate-500">Texto y color de la franja informativa superior.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <textarea
            placeholder="Ingresar el mensaje de su preferencia"
            value={headerMensaje}
            onChange={(e) => setHeaderMensaje(e.target.value)}
            className="p-4 border border-gray-300 rounded-md text-sm h-24 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Seleccionar color de fondo</label>
            <div className="flex items-center gap-2">
              <input type="color" value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer" />
              <PaintBrushIcon className="w-5 h-5 text-slate-600" />
              <span className="text-sm text-slate-500">{headerColor}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
