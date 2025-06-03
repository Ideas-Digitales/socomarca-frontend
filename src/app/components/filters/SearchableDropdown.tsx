import { useState, useRef, useEffect } from 'react';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export interface SearchableOption {
  id: string | number;
  name: string;
}

interface SearchableDropdownProps {
  options: SearchableOption[];
  selectedOption?: SearchableOption | null;
  onSelectionChange: (option: SearchableOption | null) => void;
  placeholder: string;
  searchPlaceholder?: string;
  className?: string;
  noResultsText?: string;
}

export default function SearchableDropdown({
  options,
  selectedOption,
  onSelectionChange,
  placeholder,
  searchPlaceholder = 'Buscar...',
  className = '',
  noResultsText = 'No se encontraron resultados',
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enfocar el input de búsqueda cuando se abre el dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleOptionSelect = (option: SearchableOption) => {
    onSelectionChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onSelectionChange(null);
  };

  const getDisplayText = () => {
    if (selectedOption) {
      return selectedOption.name;
    }
    return placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón principal */}
      <div
        role="button"
        tabIndex={0}
        className="bg-gray-100 w-full flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <span
          className={`${
            selectedOption ? 'text-gray-700' : 'text-gray-500'
          } truncate`}
        >
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-1">
          {selectedOption && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-300 rounded transition-colors"
              aria-label="Limpiar selección"
            >
              <XMarkIcon width={14} height={14} />
            </button>
          )}
          <ChevronDownIcon
            width={16}
            height={16}
            className={`transform transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Campo de búsqueda */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon
                width={16}
                height={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Lista de opciones */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      selectedOption?.id === option.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="block truncate">{option.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {searchTerm ? noResultsText : 'Escribe para buscar...'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
