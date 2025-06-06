'use client';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ModalConfirmacion({
  isOpen,
  titulo,
  descripcion,
  onConfirm,
  onCancel,
  icon: Icon = ExclamationTriangleIcon,
}: {
  isOpen: boolean;
  titulo: string;
  descripcion?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: React.ElementType;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow p-6 max-w-md w-full">
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-red-500 mt-1" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">{titulo}</h2>
            {descripcion && <p className="text-sm text-gray-500">{descripcion}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
