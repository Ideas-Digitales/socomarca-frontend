'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { useFilters } from '@/hooks/useFilters';
import {
  DashboardTableConfig,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import useStore from '@/stores/base';
import { useMemo } from 'react';

interface Category {
  id: string;
  categoria: string;
  rut: string;
  createdAt: string;
}

export default function CategoriesAdmin() {
  const { categories } = useStore();

  // Transformar datos una sola vez
  const productosFixed = useMemo(
    () =>
      categories.map((category) => ({
        id: String(category.id),
        categoria: category.name,
        rut: `SKU-${category.id}`,
        createdAt: `Categoría ${Math.ceil(Math.random() * 10)}`,
      })),
    [categories]
  );

  // Hook para manejar filtros (sin paginación)
  const { filters, updateCategoryFilter, updateSortOption, updateSearchTerm } =
    useFilters({
      data: productosFixed,
      searchKeys: ['categoria'],
    });

  const config: DashboardTableConfig = {
    title: 'Categorías',
    showTable: true,
    tableTitle: 'Categorías',
  };

  const categoriasColumns: TableColumn<Category>[] = [
    { key: 'id', label: 'ID' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'rut', label: 'Rut (Path)' },
    { key: 'createdAt', label: 'Fecha de creación' },
  ];

  const handleProviderFilter = () => {
    console.log('Provider filter clicked');
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  return (
    <DashboardTableLayout
      config={config}
      tableData={productosFixed}
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
