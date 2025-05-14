'use client';

import { useState } from 'react';
import SearchIcon from '../icons/SearchIcon';
import useStore from '@/stores/useStore';

export default function Search() {
  const { setSearchTerm } = useStore();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSearch = () => {
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
        <div className="flex py-4 px-4 sm:py-[28px] flex-col w-full">
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
              className="flex py-[9px] px-2 sm:px-[15px] justify-end items-center gap-[10px] button-search"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
