import { PaginationLinks, PaginationMeta } from '@/stores/base/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  meta: PaginationMeta | null;
  links?: PaginationLinks | null;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  meta,
  links,
  onPageChange,
}: PaginationProps) {
  if (!meta) return null;

  const currentPage = meta.current_page;
  const totalPages = meta.last_page;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      // Si hay menos páginas que el máximo a mostrar, mostramos todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si estamos cerca del inicio
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
      // Si estamos cerca del final
      else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
      // Si estamos en medio
      else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Versión simplificada para móvil: muestra solo algunos números
  const getMobilePageNumbers = () => {
    const pageNumbers = [];

    // En móvil mostramos como máximo 3 números de página
    if (totalPages <= 3) {
      // Si hay 3 o menos páginas, mostramos todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si estamos en la primera página
      if (currentPage === 1) {
        pageNumbers.push(1, 2, '...');
      }
      // Si estamos en la última página
      else if (currentPage === totalPages) {
        pageNumbers.push('...', totalPages - 1, totalPages);
      }
      // Para cualquier página intermedia
      else {
        pageNumbers.push(
          currentPage === 2 ? 1 : '...',
          currentPage,
          currentPage === totalPages - 1 ? totalPages : '...'
        );
      }
    }

    return pageNumbers;
  };

  // Manejadores para los botones de Anterior y Siguiente
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Verificamos si hay páginas previas o siguientes disponibles
  const hasPrevious = Boolean(links?.prev) || currentPage > 1;
  const hasNext = Boolean(links?.next) || currentPage < totalPages;

  return (
    <div className="flex py-4 px-2 md:p-[10px] items-center gap-[10px] bg-white rounded-[4px] justify-between border-b border-slate-200">
      {/* Botón Anterior */}
      <button
        onClick={handlePrevious}
        disabled={!hasPrevious}
        className={`flex justify-center items-center gap-[6px] ${
          !hasPrevious
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-lime-500 cursor-pointer'
        }`}
      >
        <ChevronLeftIcon width={16} height={16} className="flex-shrink-0" />
        <span className="text-xs font-medium">Anterior</span>
      </button>

      {/* Versión para escritorio: números de página más completos */}
      <div className="hidden sm:flex justify-center items-center gap-2">
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center font-semibold transition-colors duration-300 ${
                currentPage === page
                  ? 'border border-lime-500 rounded-md'
                  : ' hover:bg-gray-100 hover:rounded-[6px]'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Versión para móvil: números de página compactos */}
      <div className="flex sm:hidden justify-center items-center gap-1">
        {getMobilePageNumbers().map((page, index) =>
          page === '...' ? (
            <span
              key={`mobile-ellipsis-${index}`}
              className="text-gray-500 px-1"
            >
              ...
            </span>
          ) : (
            <button
              key={`mobile-page-${page}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`w-7 h-7 flex items-center justify-center font-medium text-sm transition-colors duration-300 ${
                currentPage === page
                  ? 'bg-lime-500 text-white rounded-md'
                  : 'text-gray-500 hover:bg-gray-100 hover:rounded-[6px] rounded-md'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={handleNext}
        disabled={!hasNext}
        className={`flex justify-center items-center gap-[6px] ${
          !hasNext
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-lime-500 cursor-pointer'
        }`}
      >
        <span className="text-xs font-medium">Siguiente</span>
        <ChevronRightIcon width={16} height={16} className="flex-shrink-0" />
      </button>
    </div>
  );
}
