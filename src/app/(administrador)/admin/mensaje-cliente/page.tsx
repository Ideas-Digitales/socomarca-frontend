'use client'

import { useState, useRef } from 'react'
import {
  ArrowUpTrayIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/solid'

export default function MensajesCliente() {
  const [modalActivo, setModalActivo] = useState(true)
  const [bannerActivo, setBannerActivo] = useState(true)
  const [headerMensaje, setHeaderMensaje] = useState('')
  const [headerColor, setHeaderColor] = useState('#ffffff')

  // refs de inputs file
  const modalInputRef = useRef<HTMLInputElement>(null)
  const desktopBannerRef = useRef<HTMLInputElement>(null)
  const responsiveBannerRef = useRef<HTMLInputElement>(null)

  // nombres de archivos
  const [modalFileName, setModalFileName] = useState('')
  const [desktopFileName, setDesktopFileName] = useState('')
  const [responsiveFileName, setResponsiveFileName] = useState('')

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Mensajes para el cliente</h1>
        <button className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 text-sm">
          Guardar cambios
        </button>
      </div>

      {/* Modal */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-700">Modal</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Botón subir imagen modal */}
          <div>
            <input
              type="file"
              accept="image/*"
              ref={modalInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setModalFileName(file.name)
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => modalInputRef.current?.click()}
              className="flex items-center gap-2 border rounded px-4 py-2 text-sm"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Subir imagen
            </button>
            {modalFileName && (
              <p className="text-xs text-gray-500 mt-1 truncate">{modalFileName}</p>
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
          <p className="text-sm text-lime-600 font-medium">Recomendaciones de carga</p>
          <p className="text-sm text-gray-600">
            Resolución recomendada: <strong>620x400 px</strong><br />
            Peso ideal por imagen: <strong>205 KB</strong><br />
            JPEG: Comprimido al 70–80% para mantener calidad con un tamaño pequeño.
          </p>
        </div>
      </section>

      {/* Banner principal */}
      <section className="bg-slate-50 p-4 rounded space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">Banner principal</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Botón desktop */}
          <div>
            <input
              type="file"
              accept="image/*"
              ref={desktopBannerRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setDesktopFileName(file.name)
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => desktopBannerRef.current?.click()}
              className="flex items-center gap-2 border rounded px-4 py-2 text-sm"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Subir imagen desktop
            </button>
            {desktopFileName && (
              <p className="text-xs text-gray-500 mt-1 truncate">{desktopFileName}</p>
            )}
          </div>

          {/* Botón responsivo */}
          <div>
            <input
              type="file"
              accept="image/*"
              ref={responsiveBannerRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setResponsiveFileName(file.name)
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => responsiveBannerRef.current?.click()}
              className="flex items-center gap-2 border rounded px-4 py-2 text-sm"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Subir imagen responsivo
            </button>
            {responsiveFileName && (
              <p className="text-xs text-gray-500 mt-1 truncate">{responsiveFileName}</p>
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
          <p className="text-sm text-lime-600 font-medium">Recomendaciones de carga</p>
          <p className="text-sm text-gray-600">
            Resolución recomendada: <strong>1500 x 400 px</strong> para desktop y <strong>600 x 400 px</strong> para responsivo<br />
            Peso ideal por imagen: <strong>300 KB</strong><br />
            JPEG: Comprimido al 70–80% para mantener calidad con un tamaño pequeño.
          </p>
        </div>
      </section>

      {/* Mensaje en el header */}
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
  )
}
