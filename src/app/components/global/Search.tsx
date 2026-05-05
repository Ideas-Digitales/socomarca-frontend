'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useSearch } from '@/hooks/useSearch';
import useStore from '@/stores/base';

interface SearchProps {
  onSearch: (term: string) => void;
  onClear: () => void;
  placeholder?: string;
  label?: string;
  debounceDelay?: number;
  initialValue?: string;
  showLabel?: boolean;
  className?: string;
  value?: string;
}

export default function Search({
  onSearch,
  onClear,
  placeholder = 'Busca productos ahora',
  label = 'Encuentra justo lo que necesitas con solo un clic en nuestro buscador',
  debounceDelay = 800,
  initialValue = '',
  showLabel = true,
  className = '',
}: SearchProps) {
  const { searchTerm } = useStore();
  
  const {
    inputValue,
    handleInputChange,
    handleSearch,
    handleKeyDown,
    handleClear: clearInput,
  } = useSearch({
    onSearch,
    onClear,
    debounceDelay,
    initialValue: searchTerm || initialValue,
  });

  return (
    <div className={className}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex py-4 px-4 sm:py-[28px] flex-col w-full">
          {showLabel && (
            <label
              htmlFor="search"
              className="hidden sm:block text-base sm:text-[18px] font-medium leading-6 sm:leading-7 mb-2"
            >
              {label}
            </label>
          )}
          <div className="flex relative">
            {inputValue && (
              <button
                onClick={clearInput}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-lime-600 hover:text-lime-700 transition-colors cursor-pointer z-10"
                aria-label="Limpiar búsqueda"
              >
                <XCircleIcon width={22} height={22} />
              </button>
            )}
            <input
              type="text"
              id="search"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`input-search w-full py-2 sm:py-[11px] text-sm sm:text-base ${
                inputValue ? 'pl-9 sm:pl-10' : 'pl-2 sm:pl-3'
              } pr-2 sm:pr-3`}
            />
            <button
              onClick={handleSearch}
              className="flex py-[9px] px-2 sm:px-[15px] justify-end items-center gap-[10px] button-search cursor-pointer"
            >
              <MagnifyingGlassIcon color="#fff" width={23} height={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
