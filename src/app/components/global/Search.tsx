'use client';

import { useState, useEffect, useRef } from 'react';
import useStore from '@/stores/useStore';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search() {
  const { setSearchTerm } = useStore();
  const [inputValue, setInputValue] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Limpiar el timeout anterior si existe
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Configurar un nuevo timeout
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
    }, 800); // 0.8 segundos
  };

  // Limpiar el timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = () => {
    // Cancelar cualquier debounce pendiente
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Ejecutar la búsqueda inmediatamente
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSearchTerm('');
  };

  return (
    <div className="bg-white md:bg-slate-100">
      <div className="max-w-7xl mx-auto w-full ">
        <div className="flex py-4 px-4 md:px-0 sm:py-[28px] flex-col w-full">
          <label
            htmlFor="search"
            className="hidden sm:block text-base sm:text-[18px] font-medium leading-6 sm:leading-7 mb-2"
          >
            Encuentra justo lo que necesitas con solo un clic en nuestro
            buscador
          </label>
          <div className="flex relative">
            <input
              type="text"
              id="search"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Busca productos ahora"
              className="input-search w-full px-2 sm:px-3 py-2 sm:py-[11px] text-sm sm:text-base"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-12 sm:right-16 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
            <button
              onClick={handleSearch}
              className="flex py-[9px] px-2 sm:px-[15px] justify-end items-center gap-[10px] button-search cursor-pointer"
            >
              <MagnifyingGlassIcon color='#fff' width={23} height={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
