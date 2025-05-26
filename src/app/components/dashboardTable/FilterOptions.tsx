import { Category } from '@/interfaces/category.interface';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onFilter?: () => void;
  onCategoryFilter?: (selectedIds: number[]) => void;
  onProviderFilter?: () => void;
  onSortBy?: () => void;
  categories: Category[];
  selectedCategories?: number[];
}

export default function FilterOptions({
  onFilter,
  onCategoryFilter,
  onProviderFilter,
  onSortBy,
  categories = [],
  selectedCategories = [],
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>(selectedCategories);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryToggle = (categoryId: number) => {
    const newSelectedIds = selectedIds.includes(categoryId)
      ? selectedIds.filter((id) => id !== categoryId)
      : [...selectedIds, categoryId];

    setSelectedIds(newSelectedIds);
    onCategoryFilter?.(newSelectedIds);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="w-full justify-end flex px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 flex-1-0-0 flex-col md:flex-row w-full">
          {onCategoryFilter && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="w-full md:max-w-[120px] md:w-full bg-gray-100 flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded"
                onClick={toggleDropdown}
              >
                Categorías
                <ChevronDownIcon
                  width={20}
                  height={20}
                  className={`transform transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Categorías
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(category.id)}
                            onChange={() => handleCategoryToggle(category.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {onProviderFilter && (
            <button
              className="w-full md:max-w-[216px] md:w-full bg-gray-100 flex justify-between items-center p-[10px] h-10 text-gray-500 text-md"
              onClick={onProviderFilter}
            >
              Distribuidor/Proveedor
              <MagnifyingGlassIcon width={20} height={20} />
            </button>
          )}{' '}
          {onSortBy && (
            <button
              className="w-full md:max-w-[134px] md:w-full bg-gray-100 flex justify-between items-center p-[10px] h-10 text-gray-500 text-md"
              onClick={onSortBy}
            >
              Ordenar por
              <ChevronDownIcon width={20} height={20} />
            </button>
          )}
        </div>
        {onFilter && (
          <button
            className="w-full md:max-w-[120px] md:w-full py-3 px-8 border-slate-400 rounded-[6px] h-10 border flex items-center justify-center text-gray-500 text-xs font-medium"
            onClick={onFilter}
          >
            Filtrar
          </button>
        )}
      </div>
    </div>
  );
}
