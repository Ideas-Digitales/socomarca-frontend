'use client';

import React, { useEffect } from 'react';
import useStore from '@/stores/base';
import { ModalSize } from '@/stores/base/types';

const sizeClasses: Record<ModalSize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'w-full h-full max-w-full max-h-full',
};

interface ModalProps {
  children?: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  const { isModalOpen, modalTitle, modalSize, modalContent, closeModal } =
    useStore();

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  // Detectar si es un modal de imagen (sin título y con contenido personalizado)
  const isImageModal = !modalTitle && modalContent;

  return (
    <div
      className="fixed inset-0 px-4 sm:px-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeModal}
    >
      <div
        className={`relative max-h-[90vh] w-full overflow-auto shadow-xl bg-white rounded-md p-6 ${sizeClasses[modalSize]} ${
          isImageModal ? 'bg-transparent p-0' : 'bg-white p-6'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título y botón cerrar - solo mostrar si no es modal de imagen */}
        {!isImageModal && (
          <div className="mb-4 flex items-center justify-between">
            {modalTitle && (
              <h3 className="text-[18px] font-medium">{modalTitle}</h3>
            )}
          </div>
        )}

        {/* Contenido */}
        <div>{modalContent || children}</div>
      </div>
    </div>
  );
}
