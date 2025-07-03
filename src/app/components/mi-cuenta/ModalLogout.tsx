'use client';
import { logoutAction } from '@/services/actions/auth.actions';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { useState } from 'react';

export default function ModalLogout({
  onClose,
  onLogout,
  customTitle,
  customMessage,
  confirmText = 'Continuar',
  cancelText = 'Cancelar',
  dataCyConfirm,
  dataCyCancel,
}: {
  onClose: () => void;
  onLogout?: () => Promise<void>;
  customTitle?: string;
  customMessage?: string;
  confirmText?: string;
  cancelText?: string;
  dataCyConfirm?: string;
  dataCyCancel?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await logoutAction();
        router.push('/auth/login');
      }
      onClose();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-md w-full relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner />
              <span className="text-sm text-gray-600">
                Cerrando sesión...
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 mb-4">
          <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            <h2 className="text-lg font-bold">{customTitle || '¿Deseas cerrar sesión?'}</h2>
            {customMessage && (
              <p className="text-sm text-gray-600">{customMessage}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            data-cy={dataCyConfirm}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            )}
            {isLoading ? 'Cerrando...' : confirmText}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            data-cy={dataCyCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
