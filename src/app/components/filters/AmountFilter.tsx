import { useState, useRef, useEffect } from 'react';
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface AmountRange {
  min: string;
  max: string;
}

interface AmountFilterProps {
  value: AmountRange;
  onChange: (value: AmountRange) => void;
  placeholder?: {
    min?: string;
    max?: string;
  };
  className?: string;
  // Nuevas props para validaciones
  minAllowed?: number;
  maxAllowed?: number;
}

export default function AmountFilter({
  value,
  onChange,
  placeholder = {
    min: '',
    max: '',
  },
  className = '',
  minAllowed = 0,
  maxAllowed = 999999999,
}: AmountFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{ min?: string; max?: string }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para validar valores
  const validateValues = (minVal: string, maxVal: string) => {
    const newErrors: { min?: string; max?: string } = {};

    // Convertir a números para validación
    const minNum = minVal ? parseFloat(minVal) : null;
    const maxNum = maxVal ? parseFloat(maxVal) : null;

    // Validar valor mínimo
    if (minNum !== null) {
      if (minNum < minAllowed) {
        newErrors.min = `El valor mínimo debe ser mayor o igual a ${minAllowed.toLocaleString()}`;
      } else if (minNum > maxAllowed) {
        newErrors.min = `El valor mínimo debe ser menor o igual a ${maxAllowed.toLocaleString()}`;
      }
    }

    // Validar valor máximo
    if (maxNum !== null) {
      if (maxNum < minAllowed) {
        newErrors.max = `El valor máximo debe ser mayor o igual a ${minAllowed.toLocaleString()}`;
      } else if (maxNum > maxAllowed) {
        newErrors.max = `El valor máximo debe ser menor o igual a ${maxAllowed.toLocaleString()}`;
      }
    }

    // Validar que min no sea mayor que max
    if (minNum !== null && maxNum !== null) {
      if (minNum > maxNum) {
        newErrors.min = 'El valor mínimo no puede ser mayor al máximo';
        newErrors.max = 'El valor máximo no puede ser menor al mínimo';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMinChange = (minValue: string) => {
    const newValue = {
      ...value,
      min: minValue || '',
    };

    // Validar antes de actualizar
    validateValues(newValue.min, newValue.max);
    onChange(newValue);
  };

  const handleMaxChange = (maxValue: string) => {
    const newValue = {
      ...value,
      max: maxValue || '',
    };

    // Validar antes de actualizar
    validateValues(newValue.min, newValue.max);
    onChange(newValue);
  };

  // Determinar el texto del botón
  const getButtonText = () => {
    const minVal = value.min || '';
    const maxVal = value.max || '';

    if (minVal && maxVal) {
      return `${parseFloat(minVal).toLocaleString()} - ${parseFloat(
        maxVal
      ).toLocaleString()}`;
    } else if (minVal) {
      return `Desde ${parseFloat(minVal).toLocaleString()}`;
    } else if (maxVal) {
      return `Hasta ${parseFloat(maxVal).toLocaleString()}`;
    }
    return 'Montos';
  };

  // Determinar si hay errores
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-100 flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded hover:bg-gray-200 transition-colors ${
          hasErrors ? 'border-2 border-red-300' : ''
        }`}
      >
        <span>{getButtonText()}</span>
        <div className="flex items-center gap-1">
          {hasErrors && (
            <ExclamationTriangleIcon
              width={16}
              height={16}
              className="text-red-500"
            />
          )}
          <ChevronDownIcon
            width={16}
            height={16}
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute w-full sm:w-[400px] top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
          <div className="space-y-4">
            <h3 className="text-gray-900 font-medium w-full text-sm">Montos</h3>

            <div className="space-y-3 flex sm:gap-6 flex-col sm:flex-row">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">
                  Desde
                </label>
                <input
                  type="number"
                  value={value.min || ''}
                  onChange={(e) => handleMinChange(e.target.value)}
                  placeholder={placeholder.min}
                  min={minAllowed}
                  max={maxAllowed}
                  className={`w-full bg-gray-50 border p-2 h-9 text-gray-700 text-sm rounded focus:outline-none focus:ring-2 focus:border-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${
                    errors.min
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                {errors.min && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <ExclamationTriangleIcon width={12} height={12} />
                    {errors.min}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">
                  Hasta
                </label>
                <input
                  type="number"
                  value={value.max || ''}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  placeholder={placeholder.max}
                  min={minAllowed}
                  max={maxAllowed}
                  className={`w-full bg-gray-50 border p-2 h-9 text-gray-700 text-sm rounded focus:outline-none focus:ring-2 focus:border-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${
                    errors.max
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                {errors.max && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <ExclamationTriangleIcon width={12} height={12} />
                    {errors.max}
                  </p>
                )}
              </div>
            </div>

            {/* Botón para limpiar valores */}
            {(value.min || value.max) && (
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    onChange({ min: '', max: '' });
                    setErrors({});
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
