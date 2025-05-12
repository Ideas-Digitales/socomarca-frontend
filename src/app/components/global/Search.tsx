'use client';

import { useState, useEffect } from 'react';
import SearchIcon from '../icons/SearchIcon';
import useStore from '@/stores/useStore';

export default function Search() {
  const { setSearchTerm, searchTerm } = useStore();
  const [inputValue, setInputValue] = useState(searchTerm);

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

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex py-[28px] px-[48px] flex-col w-full">
        <label htmlFor="search" className="text-[18px] font-medium leading-7">
          Encuentra justo lo que necesitas con solo un clic en nuestro buscador
        </label>
        <div className="flex">
          <input
            type="text"
            id="search"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Busca productos ahora"
            className="input-search w-full px-3 py-[11px]"
          />
          <button
            onClick={handleSearch}
            className="flex py-[9px] px-[15px] justify-end items-center gap-[10px] button-search hover:bg-lime-900 cursor-pointer"
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
