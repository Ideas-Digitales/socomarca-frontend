import { SortOption, TableColumn } from '@/interfaces/dashboard.interface';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useDropdown } from '@/hooks/useDropdown';
import { useState } from 'react';

interface SortDropdownProps {
  tableColumns: TableColumn<any>[];
  selectedOptions: SortOption[];
  onSelectionChange: (options: SortOption[]) => void;
  className?: string;
}

export default function SortDropdown({
  tableColumns,
  selectedOptions,
  onSelectionChange,
  className = '',
}: SortDropdownProps) {
  const { isOpen, toggle, ref } = useDropdown();
  const [sortOptions, setSortOptions] = useState<SortOption[]>(selectedOptions);

  const handleSortToggle = (
    column: TableColumn<any>,
    direction: 'asc' | 'desc'
  ) => {
    const existingIndex = sortOptions.findIndex(
      (option) => option.key === column.key && option.direction === direction
    );

    let newSortOptions: SortOption[];

    if (existingIndex >= 0) {
      newSortOptions = sortOptions.filter(
        (_, index) => index !== existingIndex
      );
    } else {
      const newOption: SortOption = {
        key: column.key as string,
        label: column.label,
        direction,
      };
      newSortOptions = [...sortOptions, newOption];
    }

    setSortOptions(newSortOptions);
    onSelectionChange(newSortOptions);
  };

  const isSortOptionSelected = (
    columnKey: string,
    direction: 'asc' | 'desc'
  ) => {
    return sortOptions.some(
      (option) => option.key === columnKey && option.direction === direction
    );
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        className="w-full bg-gray-100 flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded cursor-pointer"
        onClick={toggle}
      >
        Ordenar por
        <ChevronDownIcon
          width={20}
          height={20}
          className={`transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Ordenar por
            </h3>
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
                        type="checkbox"
                        checked={isSortOptionSelected(
                          column.key as string,
                          'asc'
                        )}
                        onChange={() => handleSortToggle(column, 'asc')}
                        className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-xs text-gray-700">Ascendente</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={isSortOptionSelected(
                          column.key as string,
                          'desc'
                        )}
                        onChange={() => handleSortToggle(column, 'desc')}
                        className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-xs text-gray-700">Descendente</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {sortOptions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  Orden seleccionado:
                </div>
                <div className="space-y-1">
                  {sortOptions.map((option, index) => (
                    <div
                      key={`${option.key}-${option.direction}`}
                      className="text-xs text-gray-500"
                    >
                      {index + 1}. {option.label} -{' '}
                      {option.direction === 'asc'
                        ? 'Ascendente'
                        : 'Descendente'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
