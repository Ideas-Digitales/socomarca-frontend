import { useState, useMemo } from 'react';
import { SortOption, TableColumn } from '@/interfaces/dashboard.interface';

export interface FilterState {
  selectedCategories: number[];
  sortOption: SortOption | null;
  searchTerm: string;
  selectedProviders: string[];
}

export interface UseFiltersReturn<T> {
  filters: FilterState;
  filteredAndSortedData: T[];
  updateCategoryFilter: (selectedIds: number[]) => void;
  updateSortOption: (option: SortOption | null) => void;
  updateSearchTerm: (term: string) => void;
  updateProviderFilter: (providers: string[]) => void;
  clearFilters: () => void;
}

interface UseFiltersProps<T> {
  data: T[];
  categoryKey?: keyof T;
  providerKey?: keyof T;
  searchKeys?: (keyof T)[];
  sortableColumns?: TableColumn<T>[];
}

export function useFilters<T extends Record<string, any>>({
  data,
  categoryKey,
  providerKey,
  searchKeys = [],
}: UseFiltersProps<T>): UseFiltersReturn<T> {
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    sortOption: null,
    searchTerm: '',
    selectedProviders: [],
  });

  // Aplicar filtros y ordenamiento
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filtro por búsqueda
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Filtro por categorías
    if (filters.selectedCategories.length > 0 && categoryKey) {
      result = result.filter((item) => {
        const categoryValue = item[categoryKey];
        return filters.selectedCategories.includes(Number(categoryValue));
      });
    }

    // Filtro por proveedores
    if (filters.selectedProviders.length > 0 && providerKey) {
      result = result.filter((item) => {
        const providerValue = item[providerKey];
        return filters.selectedProviders.includes(String(providerValue));
      });
    }

    // Aplicar ordenamiento
    if (filters.sortOption) {
      const { key, direction } = filters.sortOption;

      console.log('Aplicando ordenamiento:', key, direction);
      console.log('Datos antes de ordenar:', result.slice(0, 3));

      result.sort((a, b) => {
        const aValue = a[key as keyof T];
        const bValue = b[key as keyof T];

        // Manejo especial para valores null o undefined
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return direction === 'asc' ? 1 : -1;
        if (bValue == null) return direction === 'asc' ? -1 : 1;

        let comparison = 0;

        // Para IDs que son strings pero contienen números
        if (key === 'id') {
          const aNum = parseInt(String(aValue), 10);
          const bNum = parseInt(String(bValue), 10);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            comparison = aNum - bNum;
          } else {
            comparison = String(aValue).localeCompare(String(bValue));
          }
        }
        // Para números
        else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        }
        // Para strings
        else if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        }
        // Fallback
        else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return direction === 'asc' ? comparison : -comparison;
      });

      console.log('Datos después de ordenar:', result.slice(0, 3));
    }

    return result;
  }, [data, filters, categoryKey, providerKey, searchKeys]);

  // Funciones de actualización
  const updateCategoryFilter = (selectedIds: number[]) => {
    setFilters((prev) => ({ ...prev, selectedCategories: selectedIds }));
  };

  const updateSortOption = (option: SortOption | null) => {
    console.log('updateSortOption llamado con:', option);
    setFilters((prev) => ({ ...prev, sortOption: option }));
  };

  const updateSearchTerm = (term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term }));
  };

  const updateProviderFilter = (providers: string[]) => {
    setFilters((prev) => ({ ...prev, selectedProviders: providers }));
  };

  const clearFilters = () => {
    setFilters({
      selectedCategories: [],
      sortOption: null,
      searchTerm: '',
      selectedProviders: [],
    });
  };

  return {
    filters,
    filteredAndSortedData,
    updateCategoryFilter,
    updateSortOption,
    updateSearchTerm,
    updateProviderFilter,
    clearFilters,
  };
}
