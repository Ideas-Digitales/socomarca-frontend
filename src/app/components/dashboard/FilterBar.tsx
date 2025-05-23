import React from 'react';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface FilterBarProps {
  onDownload?: () => void;
  onAmountFilter?: () => void;
  onClientFilter?: () => void;
  onFilter?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onDownload,
  onAmountFilter,
  onClientFilter,
  onFilter,
}) => {
  return (
    <div className="w-full justify-end flex">
      <div className="flex flex-col md:flex-row items-center gap-3 w-full md:max-w-[552px]">
        <button
          className="block w-full md:hidden bg-lime-500 justify-between items-start py-2 h-10 text-white rounded-[6px] hover:bg-lime-600 duration-300 ease-in-out transition-colors text-md text-[14px]"
          onClick={onDownload}
        >
          Descargar datos
        </button>

        <button
          className="w-full md:w-1/3 bg-gray-100 flex justify-between items-start p-[10px] h-10 text-gray-500 text-md"
          onClick={onAmountFilter}
        >
          Montos
          <ChevronDownIcon width={20} height={20} />
        </button>

        <button
          className="w-full md:w-1/3 bg-gray-100 flex justify-between items-start p-[10px] h-10 text-gray-500 text-md"
          onClick={onClientFilter}
        >
          Cliente
          <MagnifyingGlassIcon width={20} height={20} />
        </button>

        <button
          className="w-full md:w-1/3 py-3 px-8 border-slate-400 rounded-[6px] h-10 border flex items-center justify-center text-gray-500 text-xs font-medium"
          onClick={onFilter}
        >
          Filtrar
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
