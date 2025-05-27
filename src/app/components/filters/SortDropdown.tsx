import { SortOption, TableColumn } from '@/interfaces/dashboard.interface';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useDropdown } from '@/hooks/useDropdown';
import { useState, useEffect } from 'react';

interface SortDropdownProps {
  tableColumns: TableColumn<any>[];
  selectedOption?: SortOption | null;
  onSelectionChange: (option: SortOption | null) => void;
  className?: string;
}

export default function SortDropdown({
  tableColumns,
  selectedOption = null,
  onSelectionChange,
  className = '',
}: SortDropdownProps) {
  const { isOpen, toggle, ref } = useDropdown();
  const [sortOption, setSortOption] = useState<SortOption | null>(
    selectedOption
  );

  // Sincronizar con la prop externa
  useEffect(() => {
    setSortOption(selectedOption);
  }, [selectedOption]);

  const handleSortChange = (
    column: TableColumn<any>,
    direction: 'asc' | 'desc'
  ) => {
    const newOption: SortOption = {
      key: column.key as string,
      label: column.label,
      direction,
    };

    setSortOption(newOption);
    onSelectionChange(newOption);
  };

  const handleClearSort = () => {
    setSortOption(null);
    onSelectionChange(null);
  };

  const isSortOptionSelected = (
    columnKey: string,
    direction: 'asc' | 'desc'
  ) => {
    return sortOption?.key === columnKey && sortOption?.direction === direction;
  };

  const getSelectedText = () => {
    if (!sortOption) return 'Ordenar por';
    return `${sortOption.label} (${
      sortOption.direction === 'asc' ? '↑' : '↓'
    })`;
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        className="w-full bg-gray-100 flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded cursor-pointer"
        onClick={toggle}
      >
        <span className="truncate">{getSelectedText()}</span>
        <ChevronDownIcon
          width={20}
          height={20}
          className={`transform transition-transform flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Ordenar por</h3>
              {sortOption && (
                <button
                  onClick={handleClearSort}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="space-y-3">
              {tableColumns.map((column) => (
                <div
                  key={column.key as string}
                  className="border-b border-gray-100 pb-2 last:border-b-0"
                >
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    {column.label}
                  </div>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="radio"
                        name="sort-option"
                        checked={isSortOptionSelected(
                          column.key as string,
                          'asc'
                        )}
                        onChange={() => handleSortChange(column, 'asc')}
                        className="w-3 h-3 text-lime-600 bg-gray-100 border-gray-300 "
                      />
                      <span className="text-xs text-gray-700">
                        Ascendente ↑
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="radio"
                        name="sort-option"
                        checked={isSortOptionSelected(
                          column.key as string,
                          'desc'
                        )}
                        onChange={() => handleSortChange(column, 'desc')}
                        className="w-3 h-3 text-lime-600 bg-gray-100 border-gray-300 "
                      />
                      <span className="text-xs text-gray-700">
                        Descendente ↓
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {sortOption && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  Orden actual:
                </div>
                <div className="text-xs text-lime-600 bg-lime-50 p-2 rounded">
                  {sortOption.label} -{' '}
                  {sortOption.direction === 'asc'
                    ? 'Ascendente'
                    : 'Descendente'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
