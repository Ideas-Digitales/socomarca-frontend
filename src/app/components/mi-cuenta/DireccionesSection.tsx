'use client';
import {
  HeartIcon as HeartOutline,
  HeartIcon as HeartSolid,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import ModalConfirmacion from '../global/ModalConfirmacion';

export default function DireccionesSection({
  favoritaIndex,
  setFavoritaIndex,
  setModalAbierto,
}: {
  favoritaIndex: number | null;
  setFavoritaIndex: (i: number) => void;
  setModalAbierto: (v: boolean) => void;
}) {
    const [modalVisible, setModalVisible] = useState(false);
const [direccionAEliminar, setDireccionAEliminar] = useState<string | null>(null);



  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Direcciones</h2>

      <div className="space-y-2 mb-4">
        {['Casa', 'Oficina', 'Otro'].map((nombre, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-[#edf2f7] px-4 py-2 rounded"
          >
            <div className="flex items-center gap-2 text-gray-700">
              <button
                onClick={() => setFavoritaIndex(idx)}
                title="Marcar como favorita"
              >
                {favoritaIndex === idx ? (
                  <HeartSolid className="w-5 h-5 text-gray-500" />
                ) : (
                  <HeartOutline className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <span>{nombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                title="Editar"
                onClick={() => {
                  setModalAbierto(true);
                }}
              >
                <PencilSquareIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
              </button>

            <button
  title="Eliminar"
  onClick={() => {
  setDireccionAEliminar(nombre);
  setModalVisible(true);
}}

>
  <TrashIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
</button>

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
      {modalVisible && (
  <ModalConfirmacion
  isOpen={modalVisible}
  titulo={`¿Eliminar dirección "${direccionAEliminar}"?`}
  descripcion="Esta acción eliminará la dirección seleccionada."
  onCancel={() => {
    setModalVisible(false);
    setDireccionAEliminar(null);
  }}
  onConfirm={() => {
    console.log('Eliminar dirección:', direccionAEliminar);
    // lógica real de eliminación si se implementa
    setModalVisible(false);
    setDireccionAEliminar(null);
  }}
/>

)}

    </div>
  );
}
