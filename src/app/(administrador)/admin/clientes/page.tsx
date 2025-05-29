'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { useFilters } from '@/hooks/useFilters';
import {
  DashboardTableConfig,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import { comunasRegiones } from '@/mock/comunasVentas';
import useStore from '@/stores/base';
import { useMemo, useState } from 'react';

// TODO: Esperar actualización del backend. Se está utilizando datos de CATEGORIAS, pero debería ser CLIENTES!!

interface ClientRow {
  id: string;
  categoria: string;
  rut: string;
  createdAt: string;
}

export default function ClientesAdmin() {
  const { categories } = useStore();
  const comunas = comunasRegiones;

  // Estado para las comunas seleccionadas
  const [selectedCommunes, setSelectedCommunes] = useState<string[]>([]);

  // Definir las columnas de la tabla
  const categoriasColumns: TableColumn<ClientRow>[] = [
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
    // updateCategoryFilter,
    updateSortOption,
    updateSearchTerm,
  } = useFilters({
    data: categoriesData,
    searchKeys: ['categoria', 'rut'],
    sortableColumns: categoriasColumns,
  });

  const config: DashboardTableConfig = {
    title: 'Clientes',
    showTable: true,
    tableTitle: 'Clientes',
  };

  // Manejar el cambio de comunas seleccionadas
  const handleComuneFilter = (selectedIds: string[]) => {
    console.log('Comunas seleccionadas:', selectedIds);
    setSelectedCommunes(selectedIds);
    // Aquí puedes agregar lógica adicional para filtrar los datos según las comunas
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  return (
    <DashboardTableLayout
      config={config}
      tableData={filteredAndSortedData}
      tableColumns={categoriasColumns}
      onFilter={handleFilter}
      onCommuneFilter={handleComuneFilter}
      communes={comunas}
      selectedCommunes={selectedCommunes}
      onSortBy={updateSortOption}
      categories={categories}
      selectedCategories={filters.selectedCategories}
      selectedSortOption={filters.sortOption}
      onSearch={updateSearchTerm}
      onClearSearch={() => updateSearchTerm('')}
    />
  );
}
