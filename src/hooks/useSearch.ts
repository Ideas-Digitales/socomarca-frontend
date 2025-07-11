import { useState, useEffect, useRef } from 'react';

interface UseSearchProps {
  onSearch: (term: string) => void;
  onClear: () => void;
  debounceDelay?: number;
  initialValue?: string;
}

export function useSearch({
  onSearch,
  onClear,
  debounceDelay = 800,
  initialValue = '',
}: UseSearchProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar el timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Sincronizar con initialValue cuando cambie
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Limpiar el timeout anterior si existe
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Configurar un nuevo timeout
    debounceTimeoutRef.current = setTimeout(() => {
      // Si el valor está vacío, llamar onClear
      if (!value.trim()) {
        onClear();
      } else {
        onSearch(value.trim());
      }
    }, debounceDelay);
  };

  const handleSearch = () => {
    // Cancelar cualquier debounce pendiente
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Si el input está vacío, llamar onClear
    if (!inputValue.trim()) {
      onClear();
    } else {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return {
    inputValue,
    setInputValue,
    handleInputChange,
    handleSearch,
    handleKeyDown,
    handleClear,
  };
}
