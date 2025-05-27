'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { useFilters } from '@/hooks/useFilters';
import {
  DashboardTableConfig,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import useStore from '@/stores/base';
import { useMemo } from 'react';

interface CategoryRow {
  id: string;
  categoria: string;
  rut: string;
  createdAt: string;
}

export default function CategoriesAdmin() {
  const { categories } = useStore();

  // Definir las columnas de la tabla
  const categoriasColumns: TableColumn<CategoryRow>[] = [
    { key: 'id', label: 'ID' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'rut', label: 'Rut (Path)' },
    { key: 'createdAt', label: 'Fecha de creación' },
  ];

  // Transformar datos una sola vez
  const categoriesData = useMemo(
    () =>
      categories.map((category) => ({
        id: String(category.id),
        categoria: category.name,
        rut: category.name || `categoria-${category.id}`,
        createdAt: category.created_at
          ? new Date(category.created_at).toLocaleDateString()
          : 'N/A',
      })),
    [categories]
  );

  // Hook para manejar filtros y ordenamiento
  const {
    filters,
    filteredAndSortedData,
    updateCategoryFilter,
    updateSortOption,
    updateSearchTerm,
  } = useFilters({
    data: categoriesData,
    searchKeys: ['categoria', 'rut'],
    sortableColumns: categoriasColumns,
  });

  const config: DashboardTableConfig = {
    title: 'Categorías',
    showTable: true,
    tableTitle: 'Categorías',
  };

  const handleProviderFilter = () => {
    console.log('Provider filter clicked');
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  return (
    <DashboardTableLayout
      config={config}
      tableData={filteredAndSortedData} // Usar datos filtrados y ordenados
      tableColumns={categoriasColumns}
      onFilter={handleFilter}
      onCategoryFilter={updateCategoryFilter}
      onProviderFilter={handleProviderFilter}
      onSortBy={updateSortOption}
      categories={categories}
      selectedCategories={filters.selectedCategories}
      selectedSortOption={filters.sortOption}
      onSearch={updateSearchTerm}
      onClearSearch={() => updateSearchTerm('')}
    />
  );
}
