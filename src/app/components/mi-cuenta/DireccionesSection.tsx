'use client'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import ModalConfirmacion from '../global/ModalConfirmacion'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import type { Address } from '@/services/actions/addressees.actions'
import ModalEditarDireccion from './ModalEditarDireccion'

export default function DireccionesSection({
  direcciones,
  setModalAbierto,
}: {
  direcciones: Address[]
  favoritaIndex: number | null
  setFavoritaIndex: (i: number) => void
  setModalAbierto: (v: boolean) => void
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [direccionAEliminar, setDireccionAEliminar] = useState<Address | null>(
    null
  )
  const [direccionAEditar, setDireccionAEditar] = useState<Address | null>(null)
const [region, setRegion] = useState('')
const [comuna, setComuna] = useState('')


  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Direcciones</h2>

      <div className="space-y-2 mb-4">
        {direcciones.map((direccion) => (
  <div
    key={direccion.id}
    className="flex items-center justify-between bg-[#edf2f7] px-4 py-2 rounded"
  >
    <div className="bg-[#edf2f7] space-y-1 w-full">
      <div className="flex items-center justify-between text-gray-700">
        <div className="flex items-center gap-2">
          {/* Estrella automática si es la dirección por defecto */}
          {direccion.is_default ? (
            <StarSolid className="w-5 h-5 text-lime-500" />
          ) : (
            <StarOutline className="w-5 h-5 text-gray-400" />
          )}
          <span className="font-semibold text-base">{direccion.alias || 'Sin alias'}</span>
        </div>

        {/* Iconos de acción */}
        <div className="flex items-center gap-2">
       <button
  title="Editar"
  onClick={() => {
    setDireccionAEditar(direccion)
    setRegion(direccion.region_name || '')
    setComuna(direccion.municipality_name || '')
  }}
>
  <PencilSquareIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
</button>


          <button
            title="Eliminar"
            onClick={() => {
              setDireccionAEliminar(direccion)
              setModalVisible(true)
            }}
          >
            <TrashIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 pl-7">
        <p><strong>Dirección:</strong> {direccion.address_line1}, {direccion.address_line2}</p>
        <p className="text-xs text-gray-500">
          Comuna: {direccion.municipality_name}, {direccion.region_name}
        </p>
      </div>
    </div>
  </div>
))}

      </div>

      <button
        onClick={() => setModalAbierto(true)}
        className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
      >
        Agregar nueva dirección
      </button>

      {modalVisible && direccionAEliminar && (
        <ModalConfirmacion
          isOpen={modalVisible}
          titulo={`¿Eliminar dirección "${direccionAEliminar.alias || 'Sin alias'}"?`}
          descripcion="Esta acción eliminará la dirección seleccionada."
          onCancel={() => {
            setModalVisible(false)
            setDireccionAEliminar(null)
          }}
          onConfirm={() => {
            setModalVisible(false)
            setDireccionAEliminar(null)
          }}
        />
      )}
      {direccionAEditar && (
  <ModalEditarDireccion
    region={region}
    setRegion={setRegion}
    comuna={comuna}
    setComuna={setComuna}
    onClose={() => setDireccionAEditar(null)}
  />
)}

    </div>
  )
}
