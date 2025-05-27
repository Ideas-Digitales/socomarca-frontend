import { useState, useMemo } from 'react';
import { SortOption } from '@/interfaces/dashboard.interface';

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
        // Aquí puedes ajustar la lógica según cómo manejes las categorías
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
      const sortOption = filters.sortOption;
      result.sort((a, b) => {
        const aValue = a[sortOption.key as keyof T];
        const bValue = b[sortOption.key as keyof T];

        let comparison = 0;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        }

        return sortOption.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filters, categoryKey, providerKey, searchKeys]);

  // Funciones de actualización
  const updateCategoryFilter = (selectedIds: number[]) => {
    setFilters((prev) => ({ ...prev, selectedCategories: selectedIds }));
  };

  const updateSortOption = (option: SortOption | null) => {
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
