'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpTrayIcon, PaintBrushIcon } from '@heroicons/react/24/solid';
import {
  fetchSendCustomerMessage,
  fetchGetCustomerMessage,
} from '@/services/actions/system.actions';
import { EyeIcon } from '@heroicons/react/24/outline';

export default function MensajesCliente() {
  const [modalActivo, setModalActivo] = useState(true);
  const [bannerActivo, setBannerActivo] = useState(true);
  const [headerMensaje, setHeaderMensaje] = useState('');
  const [headerColor, setHeaderColor] = useState('#ffffff');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // refs de inputs file
  const modalInputRef = useRef<HTMLInputElement>(null);
  const desktopBannerRef = useRef<HTMLInputElement>(null);
  const responsiveBannerRef = useRef<HTMLInputElement>(null);

  // archivos seleccionados
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [responsiveFile, setResponsiveFile] = useState<File | null>(null);

  // nombres de archivos
  const [modalFileName, setModalFileName] = useState('');
  const [desktopFileName, setDesktopFileName] = useState('');
  const [responsiveFileName, setResponsiveFileName] = useState('');

  // Función para cargar datos existentes
  const loadExistingData = async () => {
    setIsLoadingData(true);
    try {
      const result = await fetchGetCustomerMessage();

      if (result.ok && result.data) {
        const data = result.data;

        // Cargar datos del header
        setHeaderColor(data.header.color);
        setHeaderMensaje(data.header.content);

        // Cargar estados de banner y modal
        setBannerActivo(data.banner.enabled);
        setModalActivo(data.modal.enabled);

        // Cargar nombres de archivos existentes (si los hay)
        if (data.banner.desktop_image) {
          setDesktopFileName('Imagen desktop cargada');
        }
        if (data.banner.mobile_image) {
          setResponsiveFileName('Imagen móvil cargada');
        }
        if (data.modal.image) {
          setModalFileName('Imagen modal cargada');
        }
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Error al cargar los datos existentes',
        });
      }
    } catch (error) {
      console.log(error);
      setMessage({
        type: 'error',
        text: 'Error inesperado al cargar los datos',
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadExistingData();
  }, []);

  // Función para manejar el guardado
  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const messageData = {
        header_color: headerColor,
        header_content: headerMensaje,
        message_enabled: headerMensaje.trim().length > 0, // Habilitar si hay mensaje
        banner_desktop_image: desktopFile || undefined,
        banner_mobile_image: responsiveFile || undefined,
        banner_enabled: bannerActivo,
        modal_image: modalFile || undefined,
        modal_enabled: modalActivo,
      };

      const result = await fetchSendCustomerMessage(messageData);

      if (result.ok) {
        setMessage({
          type: 'success',
          text: 'Mensajes guardados exitosamente',
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Error al guardar los mensajes',
        });
      }
    } catch (error) {
      console.log(error);
      setMessage({
        type: 'error',
        text: 'Error inesperado al guardar los mensajes',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoadingData) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
            <p className="text-slate-600">
              Cargando configuración de mensajes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Mensajes para el cliente
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-2 rounded-md font-medium transition-colors bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
          >
            <EyeIcon className="w-5 h-5" />
            Ver en el sitio
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div
          className={`p-4 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Modal */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-700">Modal</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Botón subir imagen modal */}
          <div className="w-full sm:w-1/2">
            <input
              type="file"
              accept="image/*"
              ref={modalInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setModalFile(file);
                  setModalFileName(file.name);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => modalInputRef.current?.click()}
              disabled
              className="flex items-center gap-2 justify-center sm:justify-start border w-full rounded px-4 py-2 text-sm opacity-50 cursor-not-allowed"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Subir imagen (En desarrollo)
            </button>
            {modalFileName && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {modalFileName}
              </p>
            )}
          </div>

          {/* Activar/desactivar */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="modal"
                checked={modalActivo}
                onChange={() => setModalActivo(true)}
              />
              Activar
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="modal"
                checked={!modalActivo}
                onChange={() => setModalActivo(false)}
              />
              Desactivar
            </label>
          </div>
        </div>
        <div>
          <p className="text-sm text-lime-600 font-medium">
            Recomendaciones de carga
          </p>
          <p className="text-sm text-gray-600">
            Resolución recomendada: <strong>620x400 px</strong>
            <br />
            Peso ideal por imagen: <strong>205 KB</strong>
            <br />
            JPEG: Comprimido al 70–80% para mantener calidad con un tamaño
            pequeño.
          </p>
        </div>
      </section>

      {/* Banner principal */}
      <section className="bg-slate-50 p-4 rounded space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">
          Banner principal
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
          {/* Botón desktop */}
          <div className="w-full sm:w-auto">
            <input
              type="file"
              accept="image/*"
              ref={desktopBannerRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setDesktopFile(file);
                  setDesktopFileName(file.name);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => desktopBannerRef.current?.click()}
              disabled
              className="flex justify-center sm:justify-start items-center gap-2 border rounded px-4 py-2 text-sm w-full sm:w-auto opacity-50 cursor-not-allowed"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Subir imagen desktop (En desarrollo)
            </button>
            {desktopFileName && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {desktopFileName}
              </p>
            )}
          </div>

          {/* Botón responsivo */}
          <div className="w-full sm:w-auto">
            <input
              type="file"
              accept="image/*"
              ref={responsiveBannerRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setResponsiveFile(file);
                  setResponsiveFileName(file.name);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => responsiveBannerRef.current?.click()}
              disabled
              className="flex justify-center items-center gap-2 w-full sm:w-auto border rounded px-4 py-2 text-sm opacity-50 cursor-not-allowed"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Subir imagen responsivo (En desarrollo)
            </button>
            {responsiveFileName && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {responsiveFileName}
              </p>
            )}
          </div>

          {/* Activar/desactivar */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="banner"
                checked={bannerActivo}
                onChange={() => setBannerActivo(true)}
              />
              Activar
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="banner"
                checked={!bannerActivo}
                onChange={() => setBannerActivo(false)}
              />
              Desactivar
            </label>
          </div>
        </div>
        <div>
          <p className="text-sm text-lime-600 font-medium">
            Recomendaciones de carga
          </p>
          <p className="text-sm text-gray-600">
            Resolución recomendada: <strong>1500 x 400 px</strong> para desktop
            y <strong>600 x 400 px</strong> para responsivo
            <br />
            Peso ideal por imagen: <strong>300 KB</strong>
            <br />
            JPEG: Comprimido al 70–80% para mantener calidad con un tamaño
            pequeño.
          </p>
        </div>
      </section>

      {/* Mensaje en el header */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">
          Mensaje en el header
        </h2>
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
              <input
                type="color"
                value={headerColor}
                onChange={(e) => setHeaderColor(e.target.value)}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <PaintBrushIcon className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
