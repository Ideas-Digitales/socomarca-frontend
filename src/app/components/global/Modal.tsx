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

  return (
    <div
      className="fixed inset-0 px-4 sm:px-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeModal}
    >
      <div
        className={`relative max-h-[90vh] w-full overflow-auto bg-white p-6 shadow-xl ${sizeClasses[modalSize]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título y botón cerrar */}
        <div className="mb-4 flex items-center justify-between">
          {modalTitle && (
            <h3 className="text-[18px] font-medium">{modalTitle}</h3>
          )}
          {/* <button
            onClick={closeModal}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button> */}
        </div>

        {/* Contenido */}
        <div>{modalContent || children}</div>
      </div>
    </div>
  );
}
